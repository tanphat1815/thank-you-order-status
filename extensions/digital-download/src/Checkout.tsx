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
} from "@shopify/ui-extensions-react/checkout";

const thankyouBlock = reactExtension("purchase.thank-you.cart-line-item.render-after", () => (
  <Extension />
));

export { thankyouBlock }

const orderStatusBlock = reactExtension("customer-account.order-status.cart-line-item.render-after", () => (
  <Extension />
));

export { orderStatusBlock }

/** 
 * Converts a comma- or semicolon-separated string into an array.
 * This ensures flexibility in user input formatting.
 */
const normalizeKeywords = (input = "") =>
  input.split(/[,;]/).map(item => item.trim()).filter(Boolean);

/**
 * Checks whether the product matches a custom category (e.g., digital products).
 * It compares both attribute names and values against user-defined keywords.
 */
const checkIsCustomMatch = (attributes, customNames, customValues) => {

  return attributes.some((a) => {
    const nameLower = a.key.toLowerCase();
    const valueLower = a.value.toLowerCase();

    // Create regex patterns for matching names and values
    const nameRegex = new RegExp(`(^|[^\\p{L}\\p{N}])(${customNames.join("|")})([^\\p{L}\\p{N}]|$)`, "iu");
    const valueRegex = new RegExp(`(^|[^\\p{L}\\p{N}])(${customValues.join("|")})([^\\p{L}\\p{N}]|$)`, "iu");

    const nameMatch = nameRegex.test(nameLower);
    const valueMatch = valueRegex.test(valueLower);

    return nameMatch && valueMatch;
  });
};

/**
 * Main component responsible for displaying the UI
 */
function Extension() {
  const settings = useSettings();
  const { attributes } = useCartLineTarget();
  const titleLabel = settings.title_label ?? 'Download design:';
  const buttonLabel = settings.button_label ?? 'link';
  const customNames = normalizeKeywords(String(settings.custom_names ?? 'digital'));
  const customValues = normalizeKeywords(String(settings.custom_values ?? 'yes'));
  const isDigital = checkIsCustomMatch(attributes, customNames, customValues);
  const designLinks = attributes.filter(a => a.key.startsWith('_tib_design_link')).map(a => a.value);
  const editorMode = !!useExtensionEditor();

  // Display a preview message in the Shopify editor mode
  if (editorMode) {
    return (
      <View background="transparent" padding={['tight', 'none']}>
        <View padding={['tight', 'base']} border="dashed" cornerRadius="base" background="subdued">
          <TextBlock appearance="info">
            {`Download button will show up here when an item contains a design`}
          </TextBlock>
        </View>
      </View>
    );
  }

  // Render download links if the product is digital and contains design links
  if (isDigital && designLinks.length > 0) {
    return (
      <BlockStack>
        {designLinks.map((link, index) => (
          <Text key={index}>
            {titleLabel} <Link external to={link}>{buttonLabel} {designLinks.length > 1 ? index + 1 : ""}</Link>
          </Text>
        ))}
      </BlockStack>
    );
  }
}
