import { db } from "./index";
import { datasets, sources, tags, datasetTags } from "./schema";

const FAKE_TAGS = [
  { name: "Climate Change", slug: "climate-change" },
  { name: "Water Quality", slug: "water-quality" },
  { name: "Refugee Crisis", slug: "refugee-crisis" },
  { name: "Public Health", slug: "public-health" },
  { name: "Food Security", slug: "food-security" },
  { name: "Education", slug: "education" },
  { name: "Human Rights", slug: "human-rights" },
  { name: "Sanitation", slug: "sanitation" },
  { name: "Natural Disaster", slug: "natural-disaster" },
  { name: "Child Welfare", slug: "child-welfare" },
];

const FAKE_SOURCES = [
  {
    name: "UNHCR Open Data",
    url: "https://data.unhcr.org",
    sourceType: "external_url" as const,
    isVerified: true,
  },
  {
    name: "World Bank Data",
    url: "https://data.worldbank.org",
    sourceType: "external_url" as const,
    isVerified: true,
  },
  {
    name: "WHO Global Health Observatory",
    url: "https://www.who.int/data/gho",
    sourceType: "external_url" as const,
    isVerified: true,
  },
  {
    name: "Local NGO Data Portal",
    url: "https://local-ngo-example.org",
    sourceType: "external_url" as const,
    isVerified: false,
  },
];

const FAKE_DATASETS = [
  {
    title: "Global Refugee and Asylum Seeker Population 2023",
    description:
      "A comprehensive dataset covering the demographics, origins, and destinations of refugees and asylum seekers worldwide. Provides insights into displacement trends and humanitarian needs.",
    summary:
      "This survey data details the mass displacement of populations across regions, highlighting vulnerable groups such as unaccompanied minors and the elderly. Includes metadata on camp capacities and resettlement rates.",
    publisher: "UNHCR",
    language: "en",
    status: "approved" as const,
    fileTypes: ["csv", "json"],
    sourceIndex: 0,
    tagIndices: [2, 6, 9],
    viewCount: 1250,
    downloadCount: 340,
  },
  {
    title: "Sub-Saharan Africa Groundwater Quality Survey",
    description:
      "An extensive survey analyzing water quality samples across various regions in Sub-Saharan Africa. Includes data on heavy metals, pathogens, and seasonal variations in water tables.",
    summary:
      "The data was collected by field volunteers over an 18-month period. It helps identify critical areas requiring immediate water purification interventions and infrastructure development.",
    publisher: "World Bank",
    language: "en",
    status: "approved" as const,
    fileTypes: ["csv", "xlsx"],
    sourceIndex: 1,
    tagIndices: [1, 7, 3],
    viewCount: 890,
    downloadCount: 210,
  },
  {
    title: "Maternal Health and Mortality Rates in Rural South Asia",
    description:
      "Data collected from local health clinics detailing maternal health indicators, access to prenatal care, and mortality rates in remote communities.",
    summary:
      "This dataset reveals disparities in healthcare access and highlights the impact of community health worker programs on improving maternal outcomes.",
    publisher: "WHO",
    language: "en",
    status: "approved" as const,
    fileTypes: ["json"],
    sourceIndex: 2,
    tagIndices: [3, 9],
    viewCount: 1540,
    downloadCount: 420,
  },
  {
    title: "Post-Earthquake Housing Damage Assessment - Turkey & Syria",
    description:
      "Structural damage reports and displaced population estimates following the 2023 major earthquakes.",
    summary:
      "Volunteers mapped damaged buildings and evaluated the safety of remaining structures. This data is critical for directing reconstruction funds and temporary housing allocation.",
    publisher: "Local NGO Data Portal",
    language: "en",
    status: "approved" as const,
    fileTypes: ["csv", "pdf"],
    sourceIndex: 3,
    tagIndices: [8, 2],
    viewCount: 2300,
    downloadCount: 850,
  },
  {
    title: "Global Food Price Index and Local Scarcity Reports 2024",
    description:
      "Monthly survey data tracking the affordability of basic food staples in crisis-affected regions.",
    summary:
      "Combines macroeconomic indicators with local market surveys to predict famine risks and optimize food aid distribution networks.",
    publisher: "World Bank",
    language: "en",
    status: "approved" as const,
    fileTypes: ["xlsx"],
    sourceIndex: 1,
    tagIndices: [4, 0],
    viewCount: 670,
    downloadCount: 115,
  },
  {
    title: "Educational Attainment in Conflict Zones: Middle East",
    description:
      "Survey on the disruption of primary and secondary education due to ongoing conflicts.",
    summary:
      "Includes statistics on school closures, attendance rates, and the implementation of makeshift learning centers. Vital for NGOs focusing on child development.",
    publisher: "UNICEF",
    language: "en",
    status: "approved" as const,
    fileTypes: ["csv"],
    sourceIndex: 0,
    tagIndices: [5, 9, 2],
    viewCount: 920,
    downloadCount: 180,
  },
];

async function seed() {
  console.log("Seeding started...");

  // 1. Insert Tags
  console.log("Inserting tags...");
  const _insertedTags = await db
    .insert(tags)
    .values(FAKE_TAGS)
    .returning({ id: tags.id, slug: tags.slug })
    .onConflictDoNothing();

  // Fetch tags in case they already existed
  const allTags = await db.select({ id: tags.id, slug: tags.slug }).from(tags);
  const tagIdMap = new Map(allTags.map((t) => [t.slug, t.id]));

  // 2. Insert Sources
  console.log("Inserting sources...");
  const insertedSources = await db
    .insert(sources)
    .values(FAKE_SOURCES)
    .returning({ id: sources.id, name: sources.name });

  // 3. Insert Datasets
  console.log("Inserting datasets...");
  for (const ds of FAKE_DATASETS) {
    const sourceId = insertedSources[ds.sourceIndex].id;

    // @ts-expect-error type override
    const [insertedDataset] = await db
      .insert(datasets)
      .values({
        title: ds.title,
        description: ds.description,
        summary: ds.summary,
        publisher: ds.publisher,
        language: ds.language,
        status: ds.status,
        // @ts-expect-error type override
        fileTypes: ds.fileTypes,
        sourceId: sourceId,
        viewCount: ds.viewCount,
        downloadCount: ds.downloadCount,
      })
      .returning({ id: datasets.id });

    // 4. Insert Dataset Tags
    console.log(`Inserting tags for dataset: ${ds.title}`);
    const tagsToInsert = ds.tagIndices.map((idx) => {
      const tagSlug = FAKE_TAGS[idx].slug;
      const tagId = tagIdMap.get(tagSlug)!;
      return {
        datasetId: insertedDataset.id,
        tagId: tagId,
      };
    });

    if (tagsToInsert.length > 0) {
      await db.insert(datasetTags).values(tagsToInsert).onConflictDoNothing();
    }
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
