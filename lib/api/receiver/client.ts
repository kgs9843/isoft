const BASE_URL = `${process.env.EXPO_PUBLIC_RECEIVER_BASE_URL}`;

//client
export const postSsid = async (body: TPostSsidReqDto) => {
  console.log('아아아');
  const response = await fetch(`${BASE_URL}/ssid`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  console.log('z');
  if (!response.ok) {
    console.log('sdkjflsdjldjlfs');
    throw new Error(await response.text());
  }
  console.log('dl');
  return response.text();
};

export const getRestart = () => {
  return fetch(`${BASE_URL}/restart`, {
    method: 'GET',
  });
};

//type
export type TPostSsidReqDto = {
  ssid: string;
  password: string;
  topic: string;
};
