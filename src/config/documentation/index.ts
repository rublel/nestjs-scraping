import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import { SWAGGER } from './swagger.constants';

export function generateSwaggerApi({ app, appConfig }) {
  if (!SWAGGER.ENVS.includes(appConfig.env)) return;

  const appDocument = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(SWAGGER.SITE.TITLE)
    .setDescription(SWAGGER.SITE.DESCRIPTION)
    .setVersion(SWAGGER.SITE.VERSION)
    .addServer(SWAGGER.SERVER.LOCAL, 'Localhost')
    .addServer(SWAGGER.SERVER.DEV, 'Dev Server')
    .build();

  const document = SwaggerModule.createDocument(app, appDocument);
  SwaggerModule.setup(SWAGGER.ROUTE, app, document, {
    customSiteTitle: SWAGGER.SITE.SITE_TITLE,
  });
  const directory = path.resolve(process.cwd(), 'docs');
  if (!fs.existsSync(directory)) fs.mkdirSync(directory);
  const fileName = path.resolve(directory, 'SWAGGER.json');
  fs.writeFileSync(fileName, JSON.stringify(document));
}
