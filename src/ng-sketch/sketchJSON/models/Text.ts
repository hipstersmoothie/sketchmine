import { Base } from "./Base";
import { IBounding, IBase } from "../interfaces/Base";
import { IText, IAttributedString } from "../interfaces/Text";
import { IStyle } from "../interfaces/Style";

export class Text extends Base {
  constructor(bounding: IBounding, text: string, name?: string) {
    super();
    super.bounding = bounding;
    super.class = 'text';
    if (name) {
      super.name = name;
    }
    super.style = this.generateStyle();
    // this._x = x;
    // this._y = y;
    // this._width = width;
    // this._height = height;
    // this._text = text;
    // this._name = text;
    // this._style = style;
    // this._multiline = multiline;
  }

  private generateAttributedString(): IAttributedString {
    return {
      "_class": "MSAttributedString",
      "archivedAttributedString": {
        "_archive": "YnBsaXN0MDDUAQIDBAUGa2xYJHZlcnNpb25YJG9iamVjdHNZJGFyY2hpdmVyVCR0b3ASAAGGoK8QHQcIDxAeHyAhIi4xNzs\/R0hJSktPU19gYWJjZGZnVSRudWxs0wkKCwwNDlhOU1N0cmluZ1YkY2xhc3NcTlNBdHRyaWJ1dGVzgAKAHIADXlByaW1hcnkgYnV0dG9u0xESChMYHVdOUy5rZXlzWk5TLm9iamVjdHOkFBUWF4AEgAWABoAHpBkaGxyACIAMgBSAG4AaXxAQTlNQYXJhZ3JhcGhTdHlsZV8QH01TQXR0cmlidXRlZFN0cmluZ0ZvbnRBdHRyaWJ1dGVfECpNU0F0dHJpYnV0ZWRTdHJpbmdDb2xvckRpY3Rpb25hcnlBdHRyaWJ1dGVWTlNLZXJu1iMkJSYKJygpKissK18QEk5TUGFyYWdyYXBoU3BhY2luZ1pOU1RhYlN0b3BzW05TQWxpZ25tZW50XE5TVGV4dEJsb2Nrc1tOU1RleHRMaXN0cyNAIAAAAAAAAIAAEAKACYALgAnSEgovMKCACtIyMzQ1WiRjbGFzc25hbWVYJGNsYXNzZXNXTlNBcnJheaI0NlhOU09iamVjdNIyMzg5XxAXTlNNdXRhYmxlUGFyYWdyYXBoU3R5bGWjODo2XxAQTlNQYXJhZ3JhcGhTdHlsZdIKPD0+XxAaTlNGb250RGVzY3JpcHRvckF0dHJpYnV0ZXOAE4AN0xESCkBDRqJBQoAOgA+iREWAEIARgBJfEBNOU0ZvbnRTaXplQXR0cmlidXRlXxATTlNGb250TmFtZUF0dHJpYnV0ZSNALAAAAAAAAF8QE0Jlcm5pbmFTYW5zLVJlZ3VsYXLSMjNMTV8QE05TTXV0YWJsZURpY3Rpb25hcnmjTE42XE5TRGljdGlvbmFyedIyM1BRXxAQTlNGb250RGVzY3JpcHRvcqJSNl8QEE5TRm9udERlc2NyaXB0b3LTERIKVFkdpFVWV1iAFYAWgBeAGKRaWlpagBmAGYAZgBmAGlNyZWRVYWxwaGFUYmx1ZVVncmVlbiM\/8AAAAAAAANIyM05lok42IwAAAAAAAAAA0jIzaGlfEBJOU0F0dHJpYnV0ZWRTdHJpbmeiajZfEBJOU0F0dHJpYnV0ZWRTdHJpbmdfEA9OU0tleWVkQXJjaGl2ZXLRbW5Ucm9vdIABAAgAEQAaACMALQAyADcAVwBdAGQAbQB0AIEAgwCFAIcAlgCdAKUAsAC1ALcAuQC7AL0AwgDEAMYAyADKAMwA3wEBAS4BNQFCAVcBYgFuAXsBhwGQAZIBlAGWAZgBmgGfAaABogGnAbIBuwHDAcYBzwHUAe4B8gIFAgoCJwIpAisCMgI1AjcCOQI8Aj4CQAJCAlgCbgJ3Ao0CkgKoAqwCuQK+AtEC1ALnAu4C8wL1AvcC+QL7AwADAgMEAwYDCAMKAw4DFAMZAx8DKAMtAzADOQM+A1MDVgNrA30DgAOFAAAAAAAAAgEAAAAAAAAAbwAAAAAAAAAAAAAAAAAAA4c="
      }
    }
  }

  private generateStyle(): IStyle {
    return {
      _class: 'style',
      do_objectID: 'AE26773A-C407-44F1-BA0D-2879A5E2CFA0',
      endDecorationType: 0,
      miterLimit: 10,
      startDecorationType: 0,
      textStyle: {
        _class: 'textStyle',
        do_objectID: 'C88565D0-44B9-4FD7-AA4E-A432798038BE',
        encodedAttributes: {
          MSAttributedStringFontAttribute: {
            _archive: 'YnBsaXN0MDDUAQIDBAUGJidYJHZlcnNpb25YJG9iamVjdHNZJGFyY2hpdmVyVCR0b3ASAAGGoKkHCA0XGBkaGyJVJG51bGzSCQoLDFYkY2xhc3NfEBpOU0ZvbnREZXNjcmlwdG9yQXR0cmlidXRlc4AIgALTDg8JEBMWV05TLmtleXNaTlMub2JqZWN0c6IREoADgASiFBWABYAGgAdfEBNOU0ZvbnRTaXplQXR0cmlidXRlXxATTlNGb250TmFtZUF0dHJpYnV0ZSNALAAAAAAAAF8QE0Jlcm5pbmFTYW5zLVJlZ3VsYXLSHB0eH1okY2xhc3NuYW1lWCRjbGFzc2VzXxATTlNNdXRhYmxlRGljdGlvbmFyeaMeICFcTlNEaWN0aW9uYXJ5WE5TT2JqZWN00hwdIyRfEBBOU0ZvbnREZXNjcmlwdG9yoiUhXxAQTlNGb250RGVzY3JpcHRvcl8QD05TS2V5ZWRBcmNoaXZlctEoKVRyb290gAEACAARABoAIwAtADIANwBBAEcATABTAHAAcgB0AHsAgwCOAJEAkwCVAJgAmgCcAJ4AtADKANMA6QDuAPkBAgEYARwBKQEyATcBSgFNAWABcgF1AXoAAAAAAAACAQAAAAAAAAAqAAAAAAAAAAAAAAAAAAABfA=='
          },
          paragraphStyle: {
            _archive: 'YnBsaXN0MDDUAQIDBAUGIyRYJHZlcnNpb25YJG9iamVjdHNZJGFyY2hpdmVyVCR0b3ASAAGGoKUHCBUZH1UkbnVsbNYJCgsMDQ4PEBESExJfEBJOU1BhcmFncmFwaFNwYWNpbmdaTlNUYWJTdG9wc1tOU0FsaWdubWVudFxOU1RleHRCbG9ja3NWJGNsYXNzW05TVGV4dExpc3RzI0AgAAAAAAAAgAAQAoACgASAAtIWDRcYWk5TLm9iamVjdHOggAPSGhscHVokY2xhc3NuYW1lWCRjbGFzc2VzV05TQXJyYXmiHB5YTlNPYmplY3TSGhsgIV8QF05TTXV0YWJsZVBhcmFncmFwaFN0eWxloyAiHl8QEE5TUGFyYWdyYXBoU3R5bGVfEA9OU0tleWVkQXJjaGl2ZXLRJSZUcm9vdIABAAgAEQAaACMALQAyADcAPQBDAFAAZQBwAHwAiQCQAJwApQCnAKkAqwCtAK8AtAC/AMAAwgDHANIA2wDjAOYA7wD0AQ4BEgElATcBOgE/AAAAAAAAAgEAAAAAAAAAJwAAAAAAAAAAAAAAAAAAAUE='
          },
          MSAttributedStringColorAttribute: {
            _class: 'color',
            alpha: 1,
            blue: 1,
            green: 1,
            red: 1
          },
          kerning: 0
        },
        verticalAlignment: 0
      }
    }
  }

  generateObject(): IText {
    const base: IBase = super.generateObject();

    return {
      ...base,
      nameIsFixed: true,
      attributedString: this.generateAttributedString(),
      frame: super.addFrame('rect'),
      automaticallyDrawOnUnderlyingPath: false,
      dontSynchroniseWithSymbol: false,
      glyphBounds: '{{0, 0}, {103, 18}}',
      lineSpacingBehaviour: 2,
      textBehaviour: 0
    }
  }
}
