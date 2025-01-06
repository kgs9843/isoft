const BASE_URL = `${process.env.EXPO_PUBLIC_RECEIVER_BASE_URL}`;

//client
export const postSsid = async (body: TPostSsidReqDto) => {
  const response = await fetch(`${BASE_URL}/ssid`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    console.log('sdkjflsdjldjlfs');
    throw new Error(await response.text());
  }
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
