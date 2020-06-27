import Twit from "twit";

let T = new Twit({
  consumer_key: "LALALALALALALALALALALA",
  consumer_secret: "LALALALALALALALALALALA",
  access_token: "LALALALALALALALALALALALALALALALALALALALALALA",
  access_token_secret: "LALALALALALALALALALALA",
});

interface ITwit {
  id: string;
  user?: {
    id: string;
    followers: number;
  };
}

let earlyTwit: ITwit;
let retwitCounter = 0;

async function getTwits() {
  return new Promise((res, rej) => {
    T.get(
      "search/tweets",
      {
        q:
          "(#java OR #javascript OR #js OR #node OR #node.js OR #react OR #react.js OR #html OR #css OR #web OR #webdev OR #webdevelopment OR #game OR #gamedev OR #gamedesign OR #gamedevelopment OR #unity OR #unity3d OR #unity2d) -bot since:2020-04-18 -filter:links",
        count: 50,
      },
      function (err, data: any, response) {
        if (err) rej(err);
        res(data);
      }
    );
  });
}

async function retwit(id: string) {
  return new Promise((res, rej) => {
    T.post("statuses/retweet/:id", { id: id }, function (
      err,
      retweetData,
      response
    ) {
      if (err) rej(err);
      res(retweetData);
    });
  });
}

async function main() {
  console.log(`RETWITS COUNTER: ${retwitCounter}\n\n`);
  console.log(`GETTING TWITS...`);
  getTwits()
    .then(async (data: any) => {
      let obj: Array<any> = data["statuses"];
      console.log(`GOT ${Object.keys(obj).length} TWITS`);

      for (let i in obj) {
        let twit: ITwit = {
          id: obj[i]["id_str"],
          user: {
            id: obj[i]["user"]["id_str"],
            followers: obj[i]["user"]["followers_count"],
          },
        };

        if (earlyTwit !== twit) {
          earlyTwit = twit;
          console.log(`TWITTING...`);
          await retwit(twit.id)
            .catch((e) => {
              console.log("PROBABLY ALREADY RETWITTED");
            })
            .then((v) => {
              retwitCounter++;
            });
          console.log("DONE!\n");
        }
      }
    })
    .catch((e) => {
      console.log("DID NOT GET THE TWITTS");
    });
}

main();
