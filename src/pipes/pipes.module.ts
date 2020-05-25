import { NgModule } from '@angular/core';
import { SafeUrlPipe } from '../pipes/safe-url/safe-url';
@NgModule({
	declarations: [SafeUrlPipe],
	imports: [],
	exports: [SafeUrlPipe]
})
export class PipesModule {}
