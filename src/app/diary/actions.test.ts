
import { analyzeDiaryEntry } from './actions';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Mock the entire @google/generative-ai module
jest.mock('@google/generative-ai', () => {
  const mockGenerateContent = jest.fn();
  const mockGetGenerativeModel = jest.fn(() => ({
    generateContent: mockGenerateContent,
  }));
  return {
    GoogleGenerativeAI: jest.fn(() => ({
      getGenerativeModel: mockGetGenerativeModel,
    })),
  };
});

// Get a reference to the mocked function
const mockGenerateContent = new GoogleGenerativeAI()
  .getGenerativeModel()
  .generateContent as jest.Mock;

describe('analyzeDiaryEntry', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return analysis successfully when API call is successful', async () => {
    process.env.GOOGLE_API_KEY = 'test-api-key';

    const mockApiResponse = {
      response: {
        text: () => JSON.stringify({
          correctedText: 'This is the corrected text.',
          explanation: 'The grammar was improved.',
          fluencyScore: 85,
          keyExpressions: ['improved grammar'],
        }),
      },
    };
    mockGenerateContent.mockResolvedValue(mockApiResponse);

    const entry = 'This is a test entry.';
    const result = await analyzeDiaryEntry(entry);

    expect(result).toEqual({
      correctedText: 'This is the corrected text.',
      explanation: 'The grammar was improved.',
      fluencyScore: 85,
      keyExpressions: ['improved grammar'],
    });
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
  });

  it('should return an error if GOOGLE_API_KEY is not set', async () => {
    delete process.env.GOOGLE_API_KEY;
    const result = await analyzeDiaryEntry('test');
    expect(result).toEqual({
      error: 'Server configuration error: The GOOGLE_API_KEY is not set. Please contact the administrator.',
    });
  });

  it('should return an error if the API call fails', async () => {
    process.env.GOOGLE_API_KEY = 'test-api-key';
    const errorMessage = 'API call failed';
    mockGenerateContent.mockRejectedValue(new Error(errorMessage));

    const result = await analyzeDiaryEntry('test');
    expect(result).toEqual({
      error: `An error occurred while analyzing the entry. Details: ${errorMessage}`,
    });
  });
});
