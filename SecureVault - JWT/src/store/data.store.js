const database = {
  privateInfo: "🤫 I am going to first billionaire in my bloodline",
  raghuwar: {
    username: "raghuwar",
    password: "1234",
  },
  ravi: {
    username: "ravi",
    password: "1234",
  },
};
let id = 0;
const uuid = () => ++id;

module.exports = {
  database,
  uuid,
};
