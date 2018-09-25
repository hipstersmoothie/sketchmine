import { SvgParser } from '@sketch-svg-parser/svg-parser';
import { ISvg } from '@sketch-svg-parser/interfaces';

/* tslint:disable:max-line-length */
const checkboxDisabled = `
<svg _ngcontent-c0="" focusable="false" viewBox="0 0 512 512">
  <path _ngcontent-c0="" class="dt-checkbox-checkmark" d="M79.57 267.044l128.761 107.991 221.185-263.55" fill="transparent" stroke-dasharray="560" stroke-width="64"></path>
  <path _ngcontent-c0="" class="dt-checkbox-indeterminate" d="M80 256 h 352" fill="transparent" stroke-dasharray="352" stroke-width="64"></path>
</svg>`;

const actionspersession = `
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">
<polygon id="XMLID_419_" fill="inherit" points="370.23865,338.23825 407.67355,300.80334 245.05382,257.22491 288.6387,419.8382 
  326.06714,382.40329 411.66394,468.00009 455.83542,423.83502 "></polygon>
<path id="XMLID_420_" fill="inherit" d="M173.51688,271.43948c0.95409-4.22891,1.56006-8.58676,1.56006-13.10574
  c0-9.34746-2.35298-18.07603-6.1951-25.94722l184.31223-102.39641c6.09195,3.02986,12.86081,4.89291,20.12601,4.89291
  c25.09628,0,45.44147-20.34519,45.44147-45.44146S398.41635,44.0001,373.32007,44.0001
  c-20.47412,0-37.58316,13.62793-43.26254,32.23901h-92.14644c-5.37639-14.43374-19.16548-24.76105-35.4687-24.76105
  c-20.9705,0-37.96352,16.99301-37.96352,37.96351c0,20.96406,16.99301,37.96351,37.96352,37.96351
  c16.30322,0,30.09232-10.32732,35.4687-24.76105h92.14644c0.8703,2.84291,1.98553,5.55045,3.36508,8.12905L151.95329,211.58362
  c-10.06946-7.8454-22.57568-12.70607-36.33253-12.70607c-32.83853,0-59.45618,26.61765-59.45618,59.45619
  s26.61765,59.45618,59.45618,59.45618c18.76581,0,35.29465-8.87039,46.19571-22.45322l72.85205,25.10916l-8.24509-30.7692
  L173.51688,271.43948z"></path>
</svg>
`;

describe('checkbox disabled icon', () => {
  let svg: ISvg;
  beforeAll(() => {
    svg = SvgParser.parse(checkboxDisabled, 16, 16);
  });

  test('check if the svg consist out of two shapes', () => {
    expect(svg.shapes).toHaveLength(2);
    expect(svg.shapes.every(shape => shape.points.length > 0)).toBeTruthy();
  });

  test('checkboxDisabled to not have styles', () => {
    svg.shapes.forEach(
      shape => expect(shape.style).toMatchObject(new Map([['strokeWidth', '1']])));
  });
});
