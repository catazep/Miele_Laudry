import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

export interface LateralTab {
  label: string;
  icon?: string;
}

@Component({
  selector: 'app-lateral-tabs',
  templateUrl: './lateral-tabs.component.html',
  styleUrls: ['./lateral-tabs.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LateralTabsComponent {
  public readonly tabs = input<LateralTab[]>([]);
  public readonly selectedIndex = model(0);
}
