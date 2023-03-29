import { BadRequestException, Controller, Get, HttpStatus, Param, Query, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller('api/questions')
export class AppController {
  private static questionsFetched : boolean = false;
  private static questionsJson : JSON;
  private static questionsCount: number = 0;

  constructor(private readonly appService: AppService) {
    if(!AppController.questionsFetched) {
      this.GetQuestionsJSON().then(function(response) {
          AppController.questionsJson = response;
      });
      AppController.questionsFetched = true;
    }
  }

  @Get()
  GetQuestions() : JSON {
    return AppController.questionsJson;
  };

  @Get(':quizId')
  GetQuestion(@Res({passthrough: true}) res : Response, @Param() params : any) : JSON {
    // res.status(200);
    if(isNaN(params.quizId)) {
      res.status(HttpStatus.BAD_REQUEST).send({StatusCode: HttpStatus.BAD_REQUEST, BadRequest: 'The last parameter must be of a numerical value.'});
    }
    if(AppController.questionsJson[params.quizId - 1] === undefined) {
      res.status(HttpStatus.NOT_FOUND).send({StatusCode: HttpStatus.NOT_FOUND, NotFound: 'Object not found.'});
    }
    console.log(AppController.questionsJson[params.quizId - 1]);
    return AppController.questionsJson[params.quizId - 1];
  };
  private async GetQuestionsJSON(): Promise<JSON> {
    const quizJson = await this.appService.FetchQuizJson();
    // console.log('hi' + JSON.stringify(quizJson));
    const data = JSON.parse(this.TreatResponse(JSON.stringify(quizJson)));
    if(AppController.questionsCount === 0) {
      this.CountQuestions(data);
    }
    // console.log(data);
    return data;
  }
  private TreatResponse(res: string) : string {
    return res.replace(/%20%27/g,'\: ').replace(/%27%3F/g,'?')
              .replace(/%27/g,'\'').replace(/%20/g,' ').replace(/%3A/g,'')
              .replace(/%24/g,'').replace(/%2C/g,'').replace(/%3F/g,'?').replace(/%22/g,'');
  }
  private CountQuestions(data: JSON) : void {
    let count: number = 0;
    while(count < 25) {
      // console.log(count);
      if(data[count].category === "final") {
        AppController.questionsCount = count - 1;
        data[0].questionsCount = count - 1;
        break;
      }
      count++;
    }
  }
}
