import { NowRequest, NowResponse } from "@now/node";
import { get, xmlToJson } from "../../utils/webRequest";
import { getTMLocationUrl } from "../../utils/urls";
import {
  minTmX,
  minTmY,
  standardMapWidth,
  totalMapWidth,
  standardMapHeight,
  totalMapHeight,
} from "../../utils/define";

function parseData(data: any) {
  const locations = data.response.body.items;
  const item = locations.item.length > 1 ? locations.item[0] : locations.item;
  const tmX = item.tmX._text;
  const tmY = item.tmY._text;
  return { tmX, tmY };
}

function measurePixel(data: any) {
  const tmX = data.tmX;
  const tmY = data.tmY;
  return {
    pointX: ((tmX + minTmX) * standardMapWidth) / totalMapWidth,
    pointY:
      standardMapHeight - ((tmY + minTmY) * standardMapHeight) / totalMapHeight,
  };
}

export default (req: NowRequest, res: NowResponse) => {
  const locationName = req.query.name.toString();
  return get(getTMLocationUrl(locationName))
    .then(xmlToJson)
    .then(parseData)
    .then(measurePixel)
    .then((data: any) => res.json(data));
};
