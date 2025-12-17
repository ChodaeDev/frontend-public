import { Bell } from 'lucide-react';

interface NotificationButtonProps {
  showLabel?: boolean;
  className?: string;
}

function NotificationButton({ showLabel = false, className = '' }: NotificationButtonProps) {
  return (
    <button
      type={'button'}
      className={`flex items-center gap-3 p-2 transition-colors hover:bg-gray9 focus:outline-none ${ className }`}
      aria-label={'알림'}
    >
      <Bell className={'size-5 text-main'} />
      {showLabel && (
        <span className={'text-main'}>{'알림'}</span>
      )}
    </button>
  );
}

export default NotificationButton;

