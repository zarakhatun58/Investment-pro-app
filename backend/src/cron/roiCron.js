import { schedule } from "node-cron";

import { processDailyROI } from "../services/roiService.js";

const startROICron =
()=>{

    schedule(

"0 0 * * *",

async()=>{

console.log(
"ROI Cron Started"
);

await processDailyROI();

console.log(
"ROI Cron Finished"
);

}

);

};

export default startROICron;