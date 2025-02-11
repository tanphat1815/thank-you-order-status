import {
  reactExtension,
  BlockStack,
  Text,
  Link,
  View,
  TextBlock,
  useCartLineTarget,
  useSettings,
  useExtensionEditor
} from "@shopify/ui-extensions-react/checkout";

const thankyouBlock = reactExtension("purchase.thank-you.cart-line-item.render-after", () => (
  <Extension />
));

export { thankyouBlock }

const orderStatusBlock = reactExtension("customer-account.order-status.cart-line-item.render-after", () => (
  <Extension />
));

export { orderStatusBlock }

function Extension() {
  const settings = useSettings();
  const { attributes } = useCartLineTarget();
  const titleLabel = settings.title_label ?? 'Download design:'
  const buttonLabel = settings.button_label ?? 'Link';
  const isDigital = attributes.some((a) => a.key.toLowerCase().includes("digital") && a.value.trim().toLowerCase() === "yes");
  const designLinks = attributes.filter(a => a.key.startsWith('_tib_design_link')).map(a => a.value);
  const editorMode = !!useExtensionEditor();

  if (editorMode) {
    return (
      <View
        background='transparent'
        padding={['tight', 'none']}
      >
        <View
          padding={['tight', 'base']}
          border='dashed'
          cornerRadius='base'
          background='subdued'
        >
          <TextBlock
            appearance='info'
          >
            {`Download button will show up here when an item contains a design`}
          </TextBlock>
        </View>
      </View>
    );
  }

  return (
      <BlockStack>
      {isDigital &&  designLinks.length > 0 ? (
        <>
          {designLinks.map((link, index) => (
            <Text key={index}>
              {titleLabel} <Link external={true} to={link}> {buttonLabel} {designLinks.length > 1 ? index + 1 : ""}</Link>
            </Text>
          ))}
        </>
      ) : null}
    </BlockStack>
  )
}