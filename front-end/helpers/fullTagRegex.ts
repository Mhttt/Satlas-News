
const fullTagRegex =
  /<(?<tag>[^\/][a-zA-Z]*)(.*?)>(?<innerHtml>.+?(?=<))(?<endTag><\/[a-z]*[^>])>/gm;
const regex =
  /(?<attr>\S+)=["']?(?<val>(?<t>.(?!["']?\s+(\S+)=|[>"']))+.)["']?/gm;

export {fullTagRegex, regex}
