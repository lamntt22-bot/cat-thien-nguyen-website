// Khuyến mãi "Mua 2 tặng 1" hiện chỉ áp dụng cho đúng 1 sản phẩm (Hồng nguyệt trà 10 gói) —
// hardcode theo id thật của sản phẩm đó thay vì xây một hệ thống rule chung, vì hiện tại chỉ
// có một sản phẩm áp dụng. Nếu sau này có thêm sản phẩm áp dụng, cân nhắc chuyển thành cột
// admin-editable trên bảng products.
export const BUY2GET1_PRODUCT_ID = "b573b25c-26f3-4d3a-b34e-7cb6a2d533b3";

export function getComboInfo(quantity: number) {
  const freeBoxes = Math.floor(quantity / 2);
  return {
    freeBoxes,
    totalBoxes: quantity + freeBoxes,
    isCombo: freeBoxes > 0,
  };
}
