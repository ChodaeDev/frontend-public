'use client';

import { useState, useCallback } from 'react';
import dayjs from 'dayjs';
import Image from 'next/image';
import { Check, Trash2, Pencil, Undo2 } from 'lucide-react';
import { mockPressData } from '@/lib/mocks/press';
import type { PressPost } from '@/types/press';
import { cn } from '@/lib/cn';
import ConfirmModal from '@/components/ui/ConfirmModal';
import PressEditModal from '@/components/scj-info/PressEditModal';

type Tab = 'pending' | 'published';

export default function PressAdminContent() {
  const [posts, setPosts] = useState<PressPost[]>(() => [...mockPressData]);
  const [activeTab, setActiveTab] = useState<Tab>('pending');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [editingPost, setEditingPost] = useState<PressPost | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'delete' | 'publish' | 'unpublish';
    ids: number[];
  } | null>(null);

  const pendingPosts = posts
    .filter((p) => !p.isPublished)
    .sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf());

  const publishedPosts = posts
    .filter((p) => p.isPublished)
    .sort((a, b) => dayjs(b.publishedAt).valueOf() - dayjs(a.publishedAt).valueOf());

  const currentPosts = activeTab === 'pending' ? pendingPosts : publishedPosts;

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    const currentIds = currentPosts.map((p) => p.id);
    const allSelected = currentIds.every((id) => selectedIds.has(id));
    if (allSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        currentIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        currentIds.forEach((id) => next.add(id));
        return next;
      });
    }
  };

  const handlePublish = useCallback((ids: number[]) => {
    // TODO: API 연동
    setPosts((prev) =>
      prev.map((p) => (ids.includes(p.id) ? { ...p, isPublished: true } : p)),
    );
    setSelectedIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.delete(id));
      return next;
    });
    setConfirmAction(null);
  }, []);

  const handleUnpublish = useCallback((ids: number[]) => {
    // TODO: API 연동
    setPosts((prev) =>
      prev.map((p) => (ids.includes(p.id) ? { ...p, isPublished: false } : p)),
    );
    setSelectedIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.delete(id));
      return next;
    });
    setConfirmAction(null);
  }, []);

  const handleDelete = useCallback((ids: number[]) => {
    // TODO: API 연동
    setPosts((prev) => prev.filter((p) => !ids.includes(p.id)));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.delete(id));
      return next;
    });
    setConfirmAction(null);
  }, []);

  const handleEdit = useCallback((updated: PressPost) => {
    // TODO: API 연동
    setPosts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p)),
    );
    setEditingPost(null);
  }, []);

  const selectedCount = currentPosts.filter((p) => selectedIds.has(p.id)).length;

  const confirmMessages: Record<string, { title: string; message: string; confirmText: string }> = {
    publish: {
      title: '기사 발행',
      message: `선택한 ${ confirmAction?.ids.length ?? 0 }건의 기사를 발행하시겠습니까?`,
      confirmText: '발행',
    },
    unpublish: {
      title: '발행 취소',
      message: `선택한 ${ confirmAction?.ids.length ?? 0 }건의 기사를 발행 취소하시겠습니까?`,
      confirmText: '발행 취소',
    },
    delete: {
      title: '기사 삭제',
      message: `선택한 ${ confirmAction?.ids.length ?? 0 }건의 기사를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
      confirmText: '삭제',
    },
  };

  return (
    <div className={'my-10 rounded-xl border border-gray7 bg-background p-5'}>
      <h3 className={'text-lg font-bold text-main mb-4'}>{'기사 관리(관리자 전용)'}</h3>

      {/* 탭 */}
      <div className={'flex gap-1 mb-4'}>
        <button
          onClick={() => { setActiveTab('pending'); setSelectedIds(new Set()); }}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            activeTab === 'pending'
              ? 'bg-accent1 text-inverse'
              : 'bg-gray8 text-sub hover:bg-gray7',
          )}
        >
          {`대기중 (${ pendingPosts.length })`}
        </button>
        <button
          onClick={() => { setActiveTab('published'); setSelectedIds(new Set()); }}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            activeTab === 'published'
              ? 'bg-accent1 text-inverse'
              : 'bg-gray8 text-sub hover:bg-gray7',
          )}
        >
          {`발행됨 (${ publishedPosts.length })`}
        </button>
      </div>

      {/* 전체 선택 + 일괄 액션 바 (높이 고정) */}
      {currentPosts.length > 0 && (
        <div className={'flex items-center justify-between mb-3 h-9'}>
          <label className={'flex items-center gap-2 text-sm text-sub cursor-pointer'}>
            <input
              type={'checkbox'}
              checked={currentPosts.length > 0 && currentPosts.every((p) => selectedIds.has(p.id))}
              onChange={toggleSelectAll}
              className={'size-4 accent-accent1'}
            />
            {'전체 선택'}
          </label>
          <div className={'flex items-center gap-2'}>
            {selectedCount > 0 && (
              <>
                <span className={'text-sm text-sub'}>{`${ selectedCount }건 선택`}</span>
                {activeTab === 'pending' ? (
                  <>
                    <button
                      onClick={() => setConfirmAction({ type: 'publish', ids: [...selectedIds] })}
                      className={'px-3 py-1.5 text-sm font-medium rounded-lg bg-accent1 text-inverse hover:opacity-90 transition-opacity'}
                    >
                      {'선택된 기사 발행'}
                    </button>
                    <button
                      onClick={() => setConfirmAction({ type: 'delete', ids: [...selectedIds] })}
                      className={'px-3 py-1.5 text-sm font-medium rounded-lg bg-error text-inverse hover:opacity-90 transition-opacity'}
                    >
                      {'선택된 기사 삭제'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setConfirmAction({ type: 'unpublish', ids: [...selectedIds] })}
                    className={'px-3 py-1.5 text-sm font-medium rounded-lg bg-gray5 text-inverse hover:opacity-90 transition-opacity'}
                  >
                    {'선택된 기사 발행 취소'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* 기사 리스트 */}
      <div className={'flex flex-col gap-3'}>
        {currentPosts.length === 0 ? (
          <p className={'py-10 text-center text-sm text-gray3'}>
            {activeTab === 'pending' ? '대기중인 기사가 없습니다.' : '발행된 기사가 없습니다.'}
          </p>
        ) : (
          currentPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => toggleSelect(post.id)}
              className={cn(
                'flex items-start gap-3 rounded-lg outline outline-1 p-3 transition-colors cursor-pointer',
                selectedIds.has(post.id)
                  ? 'outline-accent1 bg-accent1/5'
                  : 'outline-gray8 bg-background hover:outline-gray6',
              )}
            >
              {/* 체크박스 */}
              <input
                type={'checkbox'}
                checked={selectedIds.has(post.id)}
                readOnly
                className={'mt-1 size-4 accent-accent1 shrink-0 pointer-events-none'}
              />

              {/* 썸네일 */}
              <div className={'relative size-16 shrink-0 overflow-hidden rounded-lg bg-gray8'}>
                {post.thumbnailUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={post.thumbnailUrl}
                    alt={post.title}
                    className={'absolute inset-0 h-full w-full object-cover'}
                  />
                ) : (
                  <Image
                    src={'/assets/images/no-image.png'}
                    alt={post.title}
                    fill
                    className={'object-contain p-1'}
                  />
                )}
              </div>

              {/* 기사 정보 + 링크 */}
              <div className={'flex-1 min-w-0'}>
                <p className={'text-sm font-semibold text-main line-clamp-1'}>{post.title}</p>
                <div className={'flex items-center gap-2 mt-1'}>
                  <span className={'text-xs text-sub'}>{post.pressName}</span>
                  <span className={'text-xs text-gray4'}>{'·'}</span>
                  <span className={'text-xs text-gray3'}>
                    {dayjs(post.publishedAt).format('YYYY.MM.DD')}
                  </span>
                </div>
                <a
                  href={post.sourceUrl}
                  target={'_blank'}
                  rel={'noopener noreferrer'}
                  onClick={(e) => e.stopPropagation()}
                  className={'inline-block mt-1 text-xs text-accent1 underline underline-offset-4 hover:opacity-70 transition-opacity'}
                >
                  {'링크'}
                </a>
              </div>

              {/* 액션 버튼 */}
              <div className={'flex flex-col sm:flex-row items-end sm:items-center gap-1 shrink-0'}>
                <button
                  onClick={(e) => { e.stopPropagation(); setEditingPost(post); }}
                  className={'flex items-center gap-1 px-2 py-1.5 rounded-md text-xs text-gray3 hover:text-accent1 hover:bg-gray8 transition-colors'}
                >
                  <Pencil className={'size-3.5'} />
                  {'수정'}
                </button>
                {activeTab === 'pending' ? (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); setConfirmAction({ type: 'publish', ids: [post.id] }); }}
                      className={'flex items-center gap-1 px-2 py-1.5 rounded-md text-xs text-gray3 hover:text-normal hover:bg-gray8 transition-colors'}
                    >
                      <Check className={'size-3.5'} />
                      {'발행'}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setConfirmAction({ type: 'delete', ids: [post.id] }); }}
                      className={'flex items-center gap-1 px-2 py-1.5 rounded-md text-xs text-gray3 hover:text-error hover:bg-gray8 transition-colors'}
                    >
                      <Trash2 className={'size-3.5'} />
                      {'삭제'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); setConfirmAction({ type: 'unpublish', ids: [post.id] }); }}
                    className={'flex items-center gap-1 px-2 py-1.5 rounded-md text-xs text-gray3 hover:text-warning hover:bg-gray8 transition-colors'}
                  >
                    <Undo2 className={'size-3.5'} />
                    {'발행 취소'}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 수정 모달 */}
      {editingPost && (
        <PressEditModal
          post={editingPost}
          onSave={handleEdit}
          onClose={() => setEditingPost(null)}
        />
      )}

      {/* 확인 모달 */}
      {confirmAction && (
        <ConfirmModal
          isOpen
          onClose={() => setConfirmAction(null)}
          onConfirm={() => {
            if (confirmAction.type === 'publish') handlePublish(confirmAction.ids);
            else if (confirmAction.type === 'unpublish') handleUnpublish(confirmAction.ids);
            else handleDelete(confirmAction.ids);
          }}
          title={confirmMessages[confirmAction.type].title}
          message={confirmMessages[confirmAction.type].message}
          confirmText={confirmMessages[confirmAction.type].confirmText}
          confirmVariant={confirmAction.type === 'delete' ? 'danger' : 'primary'}
        />
      )}
    </div>
  );
}
