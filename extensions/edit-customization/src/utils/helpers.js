import { CONFIG } from "./config";

export function getCustomizationUrl({ customizationId, productId, shop }) {
    if (!customizationId || !productId || !shop) return "";

    const queryParams = new URLSearchParams({
        "customization-id": customizationId,
        "product-id": productId.replace("gid://shopify/Product/", ""),
        "shop": shop,
    });

    return `${CONFIG.CUSTOMIZE_BASE_URL}?${queryParams}`;
}
