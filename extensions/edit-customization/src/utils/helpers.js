import { CONFIG } from "./config";

export function getCustomizationUrl({ customizationId, productId, shop }) {
    if (!customizationId || !productId || !shop) return "";

    return `${CONFIG.customize_base_url}?${new URLSearchParams({
        "customization-id": customizationId,
        "product-id": productId.replace("gid://shopify/Product/", ""),
        "shop": shop,
    })}`;
}