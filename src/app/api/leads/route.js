import { dbConnect } from "../../lib/dbConnect";
import Lead from "../../lib/models/Lead";

export async function GET() {
  await dbConnect();
  const leads = await Lead.find().sort({ createdAt: -1 });
  return Response.json(leads);
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const lead = await Lead.create(body);
  return Response.json(lead);
}