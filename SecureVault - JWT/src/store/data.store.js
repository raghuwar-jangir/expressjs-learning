const database = {
  privateInfo: "🤫 I am going to first billionaire in my bloodline",
};
let id = 0;
const uuid = () => ++id;

module.exports = {
  database,
  uuid,
};
