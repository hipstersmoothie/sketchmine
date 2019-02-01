import { Component, Input, OnDestroy, HostBinding } from '@angular/core';
import { CommunicationService } from '../../services/communication.service';
import { combineLatest, Subscription } from 'rxjs';

@Component({
  selector: 'result-item-failing',
  templateUrl: './result-item-failing.component.html',
  styleUrls: ['./result-item-failing.component.scss'],
})
export class ResultItemFailingComponent implements OnDestroy {
  @HostBinding('class.is-active') private isSelected: boolean;
  @Input() error: any;

  selection: Subscription;
  constructor(
    private cs: CommunicationService,
  ) { }

  selectElement(id: string) {
    this.selection = combineLatest(
      this.cs.selectElement(id),
      this.cs.inform(`Select element: ${id}`),
    ).subscribe(() => this.isSelected = true);
  }

  ngOnDestroy() {
    if (this.selection) {
      this.selection.unsubscribe();
    }
  }

}
