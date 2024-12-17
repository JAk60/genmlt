
export interface Paragraph {
  id: number;
  value: string;
}

export async function getParagraphs(): Promise<Paragraph[]> {
  try {
    const res = await fetch(
      "http://127.0.0.1:8000/fetch-first-column/gendata.csv", 
      { 
        cache: 'no-store',
        next: { revalidate: 0 }
      }
    );

    if (!res.ok) {
      throw new Error(
        `Failed to fetch paragraphs: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();
    const { first_column: paragraphs } = data;

    if (!paragraphs || !Array.isArray(paragraphs)) {
      throw new Error(
        "Invalid data format: 'first_column' should be an array"
      );
    }

    return paragraphs;
  } catch (error) {
    console.error("Error in getParagraphs:", error);
    throw error;
  }
}

export default async function Paragraphs() {
  try {
    const paragraphs: Paragraph[] = await getParagraphs();

    return (
      <div>
        {paragraphs.map((paragraph) => (
          <p key={paragraph.id}>{paragraph.value}</p>
        ))}
      </div>
    );
  } catch (error) {
    return (
      <div>
        <p>Error loading paragraphs: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }
}