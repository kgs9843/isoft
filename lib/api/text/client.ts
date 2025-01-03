const BASE_URL = `${process.env.EXPO_PUBLIC_BASE_URL}`;

//client
export const getFaq = async (screen: TScreen): Promise<TFaqResDto> => {
  const response = await fetch(`${BASE_URL}/faq/${screen}.json`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};

export const getDescription = async (): Promise<TDescriptionResDto> => {
  const response = await fetch(`${BASE_URL}/description/description.json`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};

//type
export type TScreen = 'S01' | 'S02' | 'R01' | 'R02' | 'R03' | 'R04';

export type TFaqResDto = {
  key: string;
  question: string;
  answer: string;
}[];

export type TDescriptionResDto = {
  [K in TScreen]: {
    key: string;
    title: string;
    description: string;
    youtube_video_url: string | null;
  };
};
