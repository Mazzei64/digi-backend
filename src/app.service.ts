import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  private readonly logger = new Logger();
  constructor(private readonly httpService: HttpService) {}

  async FetchQuizJson(): Promise<JSON> {
    const { data } = await firstValueFrom(
      this.httpService.get('https://gist.githubusercontent.com/levismad/655fb5f6f6b11c4b603f1ae4e94e1632/raw/31473a7774bb0836dc3fc81aca9bfbd09b949d09/questions.json').pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );
    const jsonStr = JSON.stringify(data);
    const initLine = '[{"questionsCount":0},';
    const finalLine = ',{"category":"final"}]';
    return JSON.parse((initLine.concat(jsonStr.substring(1))).substring(0, initLine.length - 1 + jsonStr.length - 1).concat(finalLine));
  }
}