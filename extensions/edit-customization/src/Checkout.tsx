import {
  reactExtension,
  BlockStack,
  Text,
  Link,
  View,
  TextBlock,
  useCartLineTarget,
  useSettings,
  useExtensionEditor,
  useShop,
  useOrder,
} from "@shopify/ui-extensions-react/checkout";
import { useState, useEffect } from "react";
import { getCustomizationUrl } from "./utils/helpers.js";

const thankyouBlock = reactExtension(
  "purchase.thank-you.cart-line-item.render-after",
  () => <Extension isOrderStatus={false} />
);

export { thankyouBlock };

const orderStatusBlock = reactExtension(
  "customer-account.order-status.cart-line-item.render-after",
  () => <Extension isOrderStatus={true} />
);

export { orderStatusBlock };

function Extension({ isOrderStatus }) {
  const order = isOrderStatus ? useOrder() : null;
  const { myshopifyDomain } = useShop();
  const settings = useSettings();
  const { attributes, merchandise } = useCartLineTarget();
  const buttonLabel = settings.button_label ?? "Customization edit link";
  const customizationId = attributes.find((a) => /^_?customization_id$/.test(a.key));
  const editorMode = !!useExtensionEditor();
  const [showButton, setShowButton] = useState(!isOrderStatus);
  const customizationUrl = getCustomizationUrl({
    customizationId: customizationId?.value,
    productId: merchandise.product.id,
    shop: myshopifyDomain,
  });

  useEffect(() => {
    if (!isOrderStatus || !order?.id) return;

    async function getOrderData() {
      try {
        const response = await fetch(
          "shopify://customer-account/api/2025-01/graphql.json",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: `query { 
                order(id: "${order.id}") { 
                  cancelledAt 
                  fulfillments(first: 1) { 
                    edges { 
                      node { 
                        status 
                      }
                    }
                  } 
                } 
              }`,
            }),
          }
        );

        const result = await response.json();
        const orderData = result?.data?.order;

        if (orderData?.cancelledAt === null &&
          orderData?.fulfillments?.edges[0]?.node?.status !== "SUCCESS") {
          setShowButton(true);
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    }

    getOrderData();
  }, [order?.id]);

  if (editorMode) {
    return (
      <View background="transparent" padding={["tight", "none"]}>
        <View padding={["tight", "base"]} border="dashed" cornerRadius="base" background="subdued">
          <TextBlock appearance="info">
            {`Block extension will show up here when an item contains customization data.`}
          </TextBlock>
        </View>
      </View>
    );
  }

  if (customizationId?.value && showButton) {
    return (
      <BlockStack>
        <Text>
          <Link
            external
            to={customizationUrl}
          >
            {buttonLabel}
          </Link>
        </Text>
      </BlockStack>
    );
  }
}
