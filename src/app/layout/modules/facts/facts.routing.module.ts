import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FactsComponent } from './facts.component';

const routes: Routes = [
  {
    path: '',
    component: FactsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FactsRoutingModule {}
