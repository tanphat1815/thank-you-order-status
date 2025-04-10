import {
  Button,
  Link,
  Text,
  BlockStack,
  InlineLayout,
} from "@shopify/ui-extensions-react/checkout";

interface CustomButtonProps {
  url: string;
  label: string;
  style: string;
  size: string;
  emphasis: string;
}

const getButtonStyle = (style?: string) => {
  switch (style) {
    case "Underline":
      return "plain";
    case "Outline":
      return "secondary";
    case "Primary":
      return "primary";
    default:
      return "plain";
  }
};

const getButtonSize = (size?: string) => {
  switch (size) {
    case "Small":
      return "small";
    case "Normal":
      return "base";
    case "Medium":
      return "medium";
    case "Large":
      return "large";
    default:
      return "base";
  }
};

const getButtonEmphasis = (emphasis?: string) => {
  switch (emphasis) {
    case "Italic":
      return "italic";
    case "Normal":
      return "normal";
    case "Bold":
      return "bold";
    default:
      return "normal";
  }
};

const CustomButton: React.FC<CustomButtonProps> = ({ url, label, style, size, emphasis }) => {
  const buttonStyle = getButtonStyle(style);
  const textSize = getButtonSize(size);
  const textEmphasis = getButtonEmphasis(emphasis);

  return (
    <BlockStack>
      <InlineLayout inlineAlignment="start" columns="auto">
        <Link to={url} external>
          <Button kind={buttonStyle}>
            <BlockStack>
              <Text emphasis={textEmphasis} size={textSize}>
                {label}
              </Text>
            </BlockStack>
          </Button>
        </Link>
      </InlineLayout>
    </BlockStack>
  );
};

export default CustomButton;
