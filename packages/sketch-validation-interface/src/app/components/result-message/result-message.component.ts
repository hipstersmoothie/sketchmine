import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/** @see https://regex101.com/r/nuKQ0X/4 */
const HEX_REGEX = /<(#[0-9a-fA-F]{3,6})>/igm;

// tslint:disable:max-line-length
/**
 * @see https://regexr.com/3amq5
 */
const LINK_REGEX = /((?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm;
// tslint:enable:max-line-length

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'result-message',
  template: '<p [innerHTML]="sanitizedMsg"></p>',
  styles: ['.material-icons { vertical-align: -6px }'],
})
export class ResultMessageComponent implements OnInit {
  sanitizedMsg: SafeHtml;
  @Input() message: string;
  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    let msg = this.message.replace(HEX_REGEX, wrapHexInIcon);
    msg = msg.replace(LINK_REGEX, wrapLinkInAnchor);
    this.sanitizedMsg = this.sanitizer.bypassSecurityTrustHtml(msg);
  }
}

function wrapHexInIcon(match: string, p1: string): string {
  return `<i class="material-icons" style="color: ${p1}">color_lens</i> ${p1}`;
}

function wrapLinkInAnchor(match: string): string {
  return `<a href="${match}">${match}</a>`;
}
