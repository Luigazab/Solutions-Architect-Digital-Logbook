import * as MemberModel from "../models/memberModel.js";

export async function createMember(req, res) {
  try {
    const member = await MemberModel.addMember(req.body);
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function listMembers(req, res) {
  try {
    const members = await MemberModel.getMembers();
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
