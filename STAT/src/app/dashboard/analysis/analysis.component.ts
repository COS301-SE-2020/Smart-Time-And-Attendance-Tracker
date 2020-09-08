import {
  Component, OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.sass']
})
export class AnalysisComponent implements OnInit {

  // analysis type
  graphical: boolean = true;
  predictive: boolean = false;
  // data to display
  meView : boolean = true;
  projectView : boolean = false;

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  toggleAnalysis()
  {
    let temp = this.graphical;
    this.graphical = this.predictive;
    this.predictive = temp;
    this.cd.detectChanges();
  }

  toggleView()
  {
    let temp = this.meView;
    this.meView = this.projectView;
    this.projectView = temp;
    this.cd.detectChanges();
  }
}
