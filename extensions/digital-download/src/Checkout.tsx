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

// **React Extensions for Thank You Page & Order Status Page**
const thankyouBlock = reactExtension("purchase.thank-you.cart-line-item.render-after", () => (
  <Extension />
));

export { thankyouBlock }

const orderStatusBlock = reactExtension("customer-account.order-status.cart-line-item.render-after", () => (
  <Extension />
));

export { orderStatusBlock }

// List of attributes that should be ignored from the check
const EXCLUDED_ATTRIBUTES = ["customization_id", "customization_image", "tib_design_link"];

/** 
 * Converts a comma- or semicolon-separated string into an array.
 * This ensures flexibility in user input formatting.
 */
const normalizeKeywords = (input = "") =>
  input.split(/[,;]/).map(item => item.trim()).filter(Boolean);

/**
 * Checks whether the product matches a custom category (e.g., digital products).
 * It compares both attribute keys and values against user-defined keywords.
 */
const checkIsCustomMatch = (attributes, customKeys, customValues) => {

  return attributes.some((a) => {
    const keyLower = a.key.toLowerCase();
    const valueLower = a.value.toLowerCase();

    // Skip attributes that contain any of the excluded keywords
    if (EXCLUDED_ATTRIBUTES.some(keyword => keyLower.includes(keyword))) {
      console.log(`Skipping Attribute: ${a.key}`);
      return false;
    }

    // Create regex patterns for matching keys and values
    const keyRegex = new RegExp(`\\b(${customKeys.join("|")})\\b`, "i");
    const valueRegex = new RegExp(`\\b(${customValues.join("|")})\\b`, "i");

    const keyMatch = keyRegex.test(keyLower);
    const valueMatch = valueRegex.test(valueLower);

    console.log(`Checking Attribute: { key: "${a.key}", value: "${a.value}" }`);
    console.log("Key Match:", keyMatch, "Value Match:", valueMatch);

    return keyMatch && valueMatch;
  });
};

/**
 * Main component responsible for displaying the UI
 */
function Extension() {
  const settings = useSettings();
  const { attributes } = useCartLineTarget();
  const editorMode = !!useExtensionEditor();

  // Retrieve settings from the theme editor
  const titleLabel = settings.title_label ?? 'Download design:';
  const buttonLabel = settings.button_label ?? 'Link';
  const customKeys = normalizeKeywords(String(settings.custom_keys ?? 'digital'));
  const customValues = normalizeKeywords(String(settings.custom_values ?? 'yes'));

  // Determine whether the product is categorized as "digital"
  const isDigital = checkIsCustomMatch(attributes, customKeys, customValues);
  const designLinks = attributes.filter(a => a.key.startsWith('_tib_design_link')).map(a => a.value);

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
