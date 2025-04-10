import {
  reactExtension,
  View,
  TextBlock,
  useCartLineTarget,
  useSettings,
  useExtensionEditor,
  useShop,
  useOrder,
} from "@shopify/ui-extensions-react/checkout";
import { getCustomizationUrl } from "./utils/helpers.js";
import CustomButton from "./components/CustomButton";
import { useOrderStatus } from "./hooks/useOrderStatus";

const thankyouBlock = reactExtension(
  "purchase.thank-you.cart-line-item.render-after",
  () => <Extension isOrderStatusPage={false} />
);

export { thankyouBlock };

const orderStatusBlock = reactExtension(
  "customer-account.order-status.cart-line-item.render-after",
  () => <Extension isOrderStatusPage={true} />
);

export { orderStatusBlock };

function Extension({ isOrderStatusPage }) {
  const order = isOrderStatusPage ? useOrder() : null;
  const { myshopifyDomain } = useShop();
  const settings = useSettings();
  const { attributes, merchandise } = useCartLineTarget();
  const buttonLabel = settings.button_label ?? "Customization edit link";
  const buttonStyle = settings.button_style ?? "plain";
  const buttonSize = settings.button_size ?? "base";
  const buttonEmphasis = settings.button_emphasis ?? "normal";
  const customizationId = attributes.find((a) => /^_?customization_id$/.test(a.key));
  const editorMode = !!useExtensionEditor();
  const showButton = isOrderStatusPage ? useOrderStatus(order) : true;
  const customizationUrl = getCustomizationUrl({
    customizationId: customizationId?.value,
    productId: merchandise.product.id,
    shop: myshopifyDomain,
  });

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
      <CustomButton
        url={customizationUrl}
        label={String(buttonLabel)}
        style={String(buttonStyle)}
        size={String(buttonSize)}
        emphasis={String(buttonEmphasis)}
      />
    );
  }
}
