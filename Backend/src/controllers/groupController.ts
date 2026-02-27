import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';

interface Group {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  admin: string;
  members: string[];
  createdAt: string;
}

const groups = new Map<string, Group>();

export const createGroup = (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated' });
    return;
  }

  const { name, description, avatar, members = [] } = req.body;

  if (!name || name.trim().length < 3) {
    res.status(400).json({ success: false, error: 'Group name must be at least 3 characters' });
    return;
  }

  const groupId = Date.now().toString() + Math.random().toString(36).substr(2, 9);

  const group: Group = {
    id: groupId,
    name: name.trim(),
    description,
    avatar,
    admin: req.user.identifier,
    members: [req.user.identifier, ...members],
    createdAt: new Date().toISOString(),
  };

  groups.set(groupId, group);

  res.json({
    success: true,
    group,
  });
};

export const getGroups = (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated' });
    return;
  }

  const userGroups: Group[] = [];

  groups.forEach((group) => {
    if (group.members.includes(req.user!.identifier)) {
      userGroups.push(group);
    }
  });

  res.json({
    success: true,
    groups: userGroups,
  });
};

export const addMember = (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated' });
    return;
  }

  const { groupId, userId } = req.body;
  const group = groups.get(groupId);

  if (!group) {
    res.status(404).json({ success: false, error: 'Group not found' });
    return;
  }

  if (group.admin !== req.user.identifier) {
    res.status(403).json({ success: false, error: 'Only admin can add members' });
    return;
  }

  if (group.members.includes(userId)) {
    res.status(400).json({ success: false, error: 'User already in group' });
    return;
  }

  group.members.push(userId);

  res.json({
    success: true,
    group,
  });
};

export const removeMember = (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated' });
    return;
  }

  const { groupId, userId } = req.body;
  const group = groups.get(groupId);

  if (!group) {
    res.status(404).json({ success: false, error: 'Group not found' });
    return;
  }

  if (group.admin !== req.user.identifier) {
    res.status(403).json({ success: false, error: 'Only admin can remove members' });
    return;
  }

  if (userId === group.admin) {
    res.status(400).json({ success: false, error: 'Cannot remove admin' });
    return;
  }

  const memberIndex = group.members.indexOf(userId);
  if (memberIndex >= 0) {
    group.members.splice(memberIndex, 1);
  }

  res.json({
    success: true,
    group,
  });
};

export const leaveGroup = (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated' });
    return;
  }

  const { groupId } = req.body;
  const group = groups.get(groupId);

  if (!group) {
    res.status(404).json({ success: false, error: 'Group not found' });
    return;
  }

  if (group.admin === req.user.identifier) {
    res.status(400).json({ success: false, error: 'Admin cannot leave. Transfer admin first.' });
    return;
  }

  const memberIndex = group.members.indexOf(req.user.identifier);
  if (memberIndex >= 0) {
    group.members.splice(memberIndex, 1);
  }

  res.json({ success: true });
};