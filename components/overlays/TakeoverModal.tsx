'use client';

import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/shared/Button';

interface TakeoverModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function TakeoverModal({ open, onClose, onConfirm }: TakeoverModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="text-center">
        <div className="text-5xl mb-4">🔥</div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          人机大战
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
          欢迎您挑战地狱模式：人机大战～
          <br />
          请选择确认来开始您精彩的表演
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={onClose}>
            再看看
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            ✅ 确认出战
          </Button>
        </div>
      </div>
    </Modal>
  );
}
