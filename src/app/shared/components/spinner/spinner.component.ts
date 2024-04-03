import { Component, inject } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent {
  protected showLoader: boolean = false;

  private readonly loaderService: LoaderService = inject(LoaderService);

  public ngOnInit(): void {
    this.loaderService.loaderVisibility$
      .pipe(
        tap((value) => {
          this.showLoader = value;
        })
      )
      .subscribe();
  }
}
