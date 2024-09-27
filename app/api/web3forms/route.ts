export const POST = async (req: Request) => {
  const { email } = await req.json();
  const formApiKey = process.env.WEB3FORMS_KEY;

  try {
    console.log(formApiKey);

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: formApiKey,
        email,
      }),
    });
    const data = await response.json();

    if (!data.success) {
      return Response.json(
        { message: "Failed to submit feedback" },
        { status: 500 }
      );
    }
  } catch {
    return Response.json(
      { message: "Failed to submit feedback" },
      { status: 500 }
    );
  }

  return Response.json({ message: "Feedback submitted" });
};

