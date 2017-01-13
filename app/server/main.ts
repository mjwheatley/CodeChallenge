import { Main } from "./imports/server-main/main";
import './imports/publications/dutyHours.publication.ts';
import './imports/publications/userData.publication.ts';

const mainInstance = new Main();
mainInstance.start();
