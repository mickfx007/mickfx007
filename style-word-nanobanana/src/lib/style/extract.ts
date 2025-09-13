import { ensembleDescribeStyle } from '../vendors/ensemble';
import { disambiguateTerms } from '../vendors/perplexity-factcheck';

export async function extractStyleDescriptor(images: Buffer[]): Promise<string> {
  const raw = await ensembleDescribeStyle(images);
  const final = await disambiguateTerms(raw);
  return final;
}

