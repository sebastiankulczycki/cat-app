import { Component } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent {
  showLoader: boolean = false;

  constructor(private loaderService: LoaderService) {}

  ngOnInit(): void {
    this.loaderService.loaderVisibility$
      .pipe(
        tap((value) => {
          this.showLoader = value;
        })
      )
      .subscribe();
  }
}
