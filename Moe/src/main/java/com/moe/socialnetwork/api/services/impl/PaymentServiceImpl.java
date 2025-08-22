package com.moe.socialnetwork.api.services.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TimeZone;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.moe.socialnetwork.api.dtos.ClientOrderCreateDto;
import com.moe.socialnetwork.api.services.IPaymentService;
import com.moe.socialnetwork.config.VnpayConfig;
import com.moe.socialnetwork.exception.AppException;
import com.moe.socialnetwork.jpa.CartJpa;
import com.moe.socialnetwork.jpa.DiscountJpa;
import com.moe.socialnetwork.jpa.OrderItemJpa;
import com.moe.socialnetwork.jpa.OrderJpa;
import com.moe.socialnetwork.jpa.ProductVersionJpa;
import com.moe.socialnetwork.models.Cart;
import com.moe.socialnetwork.models.Discount;
import com.moe.socialnetwork.models.Order;
import com.moe.socialnetwork.models.OrderItem;
import com.moe.socialnetwork.models.ProductVersion;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.models.Order.DeliveryStatus;
import com.moe.socialnetwork.util.VnpayUtils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;

@Service
public class PaymentServiceImpl implements IPaymentService {

    private final VnpayConfig vnpayConfig;
    private final CartJpa cartJpa;
    private final OrderJpa orderJpa;
    private final OrderItemJpa orderItemJpa;
    private final DiscountJpa discountJpa;
    private final ProductVersionJpa productVersionJpa;
    private final int fee = 30000;

    @Value("${cors.allowed.origin}")
    private String urlDomainFe;

    @Value("${app.urlDomain}")
    private String urlDomainBe;

    public PaymentServiceImpl(VnpayConfig vnpayConfig, CartJpa cartJpa, OrderJpa orderJpa,
            OrderItemJpa orderItemJpa, DiscountJpa discountJpa, ProductVersionJpa productVersionJpa) {
        this.vnpayConfig = vnpayConfig;
        this.cartJpa = cartJpa;
        this.orderJpa = orderJpa;
        this.orderItemJpa = orderItemJpa;
        this.discountJpa = discountJpa;
        this.productVersionJpa = productVersionJpa;
    }

    @Transactional
    public Map<String, String> vnpayIpn(HttpServletRequest request) {
        Map<String, String> response = new HashMap<>();
        try {
            Map<String, String> fields = new HashMap<>();
            Map<String, String[]> requestParams = request.getParameterMap();

            // Lấy tất cả params
            for (Map.Entry<String, String[]> entry : requestParams.entrySet()) {
                String name = entry.getKey();
                String value = entry.getValue()[0];
                if (value != null && !value.isEmpty()) {
                    fields.put(name, value);
                }
            }

            // Lấy chữ ký VNPAY
            String vnp_SecureHash = fields.remove("vnp_SecureHash");
            String signValue = hashFields(fields, vnpayConfig.getVnpayHashSecret());

            if (!signValue.equals(vnp_SecureHash)) {
                response.put("RspCode", "97");
                response.put("Message", "Invalid Signature");
                return response;
            }

            // Lấy thông tin từ params
            String orderCode = fields.get("vnp_TxnRef");
            String responseCode = fields.get("vnp_ResponseCode");
            String transactionStatus = fields.get("vnp_TransactionStatus");

            UUID orderUuid = UUID.fromString(orderCode);
            Order order = orderJpa.findByCode(orderUuid)
                    .orElseThrow(() -> new AppException("Order not found with code: " + orderCode, 404));

            if ("00".equals(responseCode) && "00".equals(transactionStatus)) {
                List<OrderItem> orderItems = orderItemJpa.findByOrderCode(order.getCode());

                // Kiểm tra tồn kho trước
                boolean enoughStock = true;
                for (OrderItem item : orderItems) {
                    ProductVersion pv = item.getProductVersion();
                    if (pv != null && pv.getQuantity() < item.getQuantity()) {
                        enoughStock = false;
                        break;
                    }
                }

                if (enoughStock) {
                    // Trừ kho thật sự
                    for (OrderItem item : orderItems) {
                        ProductVersion pv = item.getProductVersion();
                        pv.setQuantity(pv.getQuantity() - item.getQuantity());
                        productVersionJpa.save(pv);
                    }

                    order.setDeliveryStatus(DeliveryStatus.PENDING);

                    // Xóa giỏ hàng
                    List<Cart> cart = cartJpa.findCartByUserId(order.getUserCreate().getId());
                    if (cart != null && !cart.isEmpty()) {
                        cartJpa.deleteAll(cart);
                    }
                } else {
                    order.setDeliveryStatus(DeliveryStatus.PAYMENT_REFUND);
                }
            } else {
                order.setDeliveryStatus(DeliveryStatus.PAYMENT_CANCELED);
            }

            orderJpa.save(order);

            response.put("RspCode", "00");
            response.put("Message", "Confirm Success");
            return response;

        } catch (Exception e) {
            response.put("RspCode", "99");
            response.put("Message", "Internal Server Error: " + e.getMessage());
            return response;
        }
    }

    /**
     * Hàm tạo hash từ Map fields
     */
    private String hashFields(Map<String, String> fields, String secretKey) throws Exception {
        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        for (int i = 0; i < fieldNames.size(); i++) {
            String fieldName = fieldNames.get(i);
            String fieldValue = fields.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                hashData.append(fieldName).append("=")
                        .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (i < fieldNames.size() - 1) {
                    hashData.append("&");
                }
            }
        }

        return VnpayUtils.hmacSHA512(secretKey, hashData.toString());
    }

    @Transactional
    public Map<String, String> createPayment(User user, ClientOrderCreateDto orderCreateDto,
            HttpServletRequest request) {
        try {
            // Kiểm tra giỏ hàng
            List<Cart> cart = cartJpa.findCartByUserId(user.getId());
            if (cart.isEmpty()) {
                throw new AppException(
                        "Your cart is empty. Please add products to your cart before proceeding with payment.", 400);
            }

            // Tạo order
            Order order = new Order();
            order.setQuantity(0);
            order.setPrice(BigDecimal.ZERO);
            order.setDiscountAmount(BigDecimal.ZERO);
            order.setShippingFee(BigDecimal.valueOf(fee));
            order.setTotal(BigDecimal.ZERO);
            order.setFirstName(orderCreateDto.getFirstName());
            order.setLastName(orderCreateDto.getLastName());
            order.setEmail(orderCreateDto.getEmail());
            order.setPhone(orderCreateDto.getPhone());
            order.setAddress(orderCreateDto.getAddress());
            order.setTownCity(orderCreateDto.getCity());
            order.setState(orderCreateDto.getState());
            order.setCountry(orderCreateDto.getCountry());
            order.setNotes(orderCreateDto.getNotes());
            order.setPaymentMethod("VNPAY");
            order.setUserCreate(user);
            order.setUserUpdate(user);
            order.setDeliveryStatus(DeliveryStatus.PAYMENT_PENDING);
            orderJpa.save(order);

            // Tạo order items
            List<OrderItem> orderItems = new ArrayList<>();
            for (Cart item : cart) {
                ProductVersion productVersion = item.getProductVersion();
                if (productVersion == null) {
                    throw new AppException("Product version not found for cart item: " + item.getId(), 404);
                }

                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order);
                orderItem.setProductVersion(productVersion);
                orderItem.setQuantity(item.getQuantity());
                orderItem.setPrice(getFinalPrice(productVersion));
                orderItem.setUserCreate(user);
                orderItems.add(orderItem);
            }
            orderItemJpa.saveAll(orderItems);

            // Cập nhật tổng số lượng và giá trị của đơn hàng
            recalculateOrderTotals(order);

            // Kiểm tra và áp dụng discountCode
            BigDecimal discountAmount = BigDecimal.ZERO;

            if (orderCreateDto.getDiscountCode() != null && !orderCreateDto.getDiscountCode().isEmpty()) {
                Optional<Discount> discountOpt = discountJpa.findValidDiscountByCode(orderCreateDto.getDiscountCode());
                if (discountOpt.isPresent()) {
                    Discount discount = discountOpt.get();
                    if (isValid(discount.getStartDate(), discount.getEndDate())) {
                        order.setDiscount(discount);
                        // Nếu discount theo %:
                        if (discount.getDiscountValue() != null) {
                            discountAmount = order.getTotal().multiply(discount.getDiscountValue())
                                    .divide(BigDecimal.valueOf(100));
                            if (discount.getMaxDiscount() != null
                                    && discountAmount.compareTo(discount.getMaxDiscount()) > 0) {
                                discountAmount = discount.getMaxDiscount();
                            }
                        }
                    }
                }
            }

            // Cập nhật order
            order.setDiscountAmount(discountAmount);
            order.setTotal(order.getTotal().subtract(discountAmount).max(BigDecimal.ZERO)); // tránh âm
            orderJpa.save(order);

            // Tạo tham số VNPAY
            String vnp_TxnRef = order.getCode().toString(); // Sử dụng order code làm mã giao dịch
            String vnp_IpAddr = request.getRemoteAddr();
            if (vnp_IpAddr == null || vnp_IpAddr.isEmpty() || vnp_IpAddr.contains(":")) {
                vnp_IpAddr = "127.0.0.1";
            }

            Map<String, String> vnp_Params = new HashMap<>();
            vnp_Params.put("vnp_Version", vnpayConfig.VNPAY_VERSION);
            vnp_Params.put("vnp_Command", vnpayConfig.VNPAY_COMMAND);
            vnp_Params.put("vnp_TmnCode", vnpayConfig.getVnpayTmnCode());
            vnp_Params.put("vnp_Amount", String.valueOf(
                    order.getTotal().setScale(0, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)).longValue()));
            vnp_Params.put("vnp_CurrCode", vnpayConfig.VNPAY_CURR_CODE);
            vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
            vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang: " + vnp_TxnRef);
            vnp_Params.put("vnp_OrderType", "other"); // hoặc other đẻ chọn tùy chọn Thêm OrderType như trong VNPAY
                                                      // sample
            vnp_Params.put("vnp_BankCode", "NCB"); // test bank code
            vnp_Params.put("vnp_OrderType", "billpayment"); // hoặc bất kỳ loại nào trong tài liệu VNPAY

            // Ngôn ngữ
            vnp_Params.put("vnp_Locale", vnpayConfig.VNPAY_LOCALE);

            vnp_Params.put("vnp_ReturnUrl", urlDomainFe + "/payment-return");
            // IP
            vnp_Params.put("vnp_IpAddr", vnp_IpAddr != null ? vnp_IpAddr : "127.0.0.1");

            // Ngày tạo
            Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
            SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
            String vnp_CreateDate = formatter.format(cld.getTime());
            vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

            // Ngày hết hạn (+15 phút)
            cld.add(Calendar.MINUTE, 15);
            String vnp_ExpireDate = formatter.format(cld.getTime());
            vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

            // Build hashData & query string
            List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
            Collections.sort(fieldNames);
            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();
            Iterator<String> itr = fieldNames.iterator();
            while (itr.hasNext()) {
                String fieldName = itr.next();
                String fieldValue = vnp_Params.get(fieldName);
                if (fieldValue != null && !fieldValue.isEmpty()) {
                    // Build hash data
                    hashData.append(fieldName).append('=')
                            .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    // Build query
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString())).append('=')
                            .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    if (itr.hasNext()) {
                        query.append('&');
                        hashData.append('&');
                    }
                }
            }

            // Tạo secure hash
            String vnp_SecureHash = VnpayUtils.hmacSHA512(vnpayConfig.getVnpayHashSecret(), hashData.toString());
            query.append("&vnp_SecureHash=").append(vnp_SecureHash);

            // Payment URL
            String paymentUrl = vnpayConfig.VNPAY_PAY_URL + "?" + query.toString();

            // Response
            Map<String, String> response = new HashMap<>();
            response.put("code", "00");
            response.put("message", "success");
            response.put("paymentUrl", paymentUrl);

            return response;

        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            throw new AppException("Failed to create payment: " + e.getMessage(), 500);
        }
    }

    public void recalculateOrderTotals(Order order) {
        List<OrderItem> orderItems = orderItemJpa.findByOrderCode(order.getCode());

        if (orderItems == null || orderItems.isEmpty()) {
            order.setQuantity(0);
            order.setPrice(BigDecimal.ZERO);
            order.setDiscountAmount(BigDecimal.ZERO);
            order.setTotal(BigDecimal.ZERO);
            orderJpa.save(order);
            return;
        }

        int totalQuantity = orderItems.stream()
                .mapToInt(OrderItem::getQuantity)
                .sum();

        BigDecimal tongGiaSanPham = orderItems.stream()
                .filter(item -> item.getPrice() != null)
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setQuantity(totalQuantity);
        order.setPrice(tongGiaSanPham);

        BigDecimal giaGiam = BigDecimal.ZERO;
        if (order.getDiscount() != null && order.getDiscount().getDiscountValue() != null
                && isValid(order.getDiscount().getStartDate(), order.getDiscount().getEndDate())) {
            BigDecimal discountValue = order.getDiscount().getDiscountValue();
            if (discountValue.compareTo(BigDecimal.ZERO) >= 0
                    && discountValue.compareTo(BigDecimal.valueOf(100)) <= 0) {
                giaGiam = tongGiaSanPham.multiply(discountValue)
                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

                // So sánh với maxDiscount
                BigDecimal maxDiscount = order.getDiscount().getMaxDiscount();
                if (maxDiscount != null && giaGiam.compareTo(maxDiscount) > 0) {
                    giaGiam = maxDiscount;
                }
            }
        }
        order.setDiscountAmount(giaGiam);

        BigDecimal phiVanChuyen = order.getShippingFee() != null ? order.getShippingFee() : BigDecimal.ZERO;

        BigDecimal tongCuoiCung = tongGiaSanPham.add(phiVanChuyen).subtract(giaGiam);
        order.setTotal(tongCuoiCung);

        orderJpa.save(order);
    }

    private BigDecimal getFinalPrice(ProductVersion productVersion) {
        BigDecimal discountPrice = BigDecimal.ZERO; // Số tiền giảm
        BigDecimal finalPrice = productVersion.getProduct().getPrice(); // Giá sau giảm (mặc định là giá gốc)

        List<Discount> discounts = discountJpa.findByProductCode(productVersion.getProduct().getCode(), null);

        if (!discounts.isEmpty()) {
            for (Discount discount : discounts) {
                if (isValid(discount.getStartDate(), discount.getEndDate())) {
                    // Tính số tiền giảm
                    discountPrice = productVersion.getProduct().getPrice()
                            .multiply(discount.getDiscountValue())
                            .divide(BigDecimal.valueOf(100));

                    // Giới hạn số tiền giảm
                    if (discount.getMaxDiscount() != null &&
                            discountPrice.compareTo(discount.getMaxDiscount()) > 0) {
                        discountPrice = discount.getMaxDiscount();
                    }

                    // Cập nhật giá sau giảm
                    finalPrice = productVersion.getProduct().getPrice().subtract(discountPrice);
                    break; // Nếu chỉ áp dụng 1 discount hợp lệ thì thoát luôn
                }
            }
        }
        return finalPrice;
    }

    private boolean isValid(LocalDateTime startDate, LocalDateTime endDate) {
        LocalDateTime now = LocalDateTime.now();

        // Nếu startDate sau thời điểm hiện tại => chưa có hiệu lực
        if (startDate.isAfter(now)) {
            return false;
        }

        // Nếu endDate null => không có hạn kết thúc => luôn hợp lệ sau startDate
        if (endDate == null) {
            return true;
        }

        // Nếu endDate >= hiện tại => còn hạn
        return !endDate.isBefore(now);
    }
}