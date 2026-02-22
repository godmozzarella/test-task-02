import { NextResponse } from "next/server";

export async function GET() {
  const response = await fetch(
    `https://app.tablecrm.com/api/v1/nomenclature/?token=af1874616430e04cfd4bce30035789907e899fc7c3a1a4bb27254828ff304a77`
  );

  const data = response.headers.get("content-type")?.includes("application/json")
    ? await response.json()
    : null;

  return NextResponse.json(data, { status: response.status });
}

export async function POST(req: Request) {
  const body = await req.json();

  const response = await fetch(
    `https://app.tablecrm.com/api/v1/nomenclature/?token=af1874616430e04cfd4bce30035789907e899fc7c3a1a4bb27254828ff304a77`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  const data = response.headers.get("content-type")?.includes("application/json")
    ? await response.json()
    : null;

  return NextResponse.json(data, { status: response.status });
}
