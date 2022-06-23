interface Env {
  [key: string]: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // console.log(env.DKIM_PRIVATE_KEY);
    let send_request = new Request("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [
              {
                email: "", // add your to email here
              },
            ],
            dkim_domain: "", // add your domain
            dkim_selector: "mailchannels",
            dkim_private_key: env.DKIM_PRIVATE_KEY,
          },
        ],
        from: {
          email: "", // add your from email here
        },
        subject: "Subject",
        content: [
          {
            type: "text/plain",
            value: "message",
          },
        ],
      }),
    });

    let respContent = "";
    // only send the mail on "POST", to avoid spiders, etc.
    if (request.method == "POST") {
      const resp = await fetch(send_request);
      const respText = await resp.text();

      respContent = resp.status + " " + resp.statusText + "\n\n" + respText;
    }

    let htmlContent = `<html><head></head><body><p>Click to send message: <form method="post"><input type="submit" value="Send"/></form></p><pre>${respContent}</pre></body></html>`;
    return new Response(htmlContent, {
      headers: { "content-type": "text/html" },
    });
  },
};
