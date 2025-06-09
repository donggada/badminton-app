import React, { useState, useCallback } from 'react';
import { XMarkIcon, UserCircleIcon, ClockIcon, UserGroupIcon, QrCodeIcon, NoSymbolIcon, ShareIcon, ClipboardIcon, ClipboardDocumentCheckIcon, EllipsisVerticalIcon, UserPlusIcon, UserMinusIcon, ShieldCheckIcon, ArrowsRightLeftIcon, ScaleIcon, UserGroupIcon as UserGroupSolidIcon, ArrowPathIcon, PlayIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { updateMatchingStatus, grantManagerRole, revokeManagerRole, startMatching, startCustomMatching, replaceGroupMember, updateAllGroupsStatus } from '../services/Axios';

function MatchingRoomScreen({ onExitRoom, onStartMatching, isManager, roomData, onNavigateToMatchingRoom, onRefreshRoomData }) {
  const [showRoomCode, setShowRoomCode] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [shareError, setShareError] = useState(null);
  const [isCodeCopied, setIsCodeCopied] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState(null);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showManagerConfirm, setShowManagerConfirm] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isUpdatingManager, setIsUpdatingManager] = useState(false);
  const [isRevokingManager, setIsRevokingManager] = useState(false);
  const [managerError, setManagerError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showMatchingOptions, setShowMatchingOptions] = useState(false);
  const [isStartingMatching, setIsStartingMatching] = useState(false);
  const [matchingError, setMatchingError] = useState(null);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [currentGroup, setCurrentGroup] = useState([]);
  const [customGroups, setCustomGroups] = useState([]);
  const [showMemberReplaceModal, setShowMemberReplaceModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isReplacingMember, setIsReplacingMember] = useState(false);
  const [replaceError, setReplaceError] = useState(null);
  const [isUpdatingGroupsStatus, setIsUpdatingGroupsStatus] = useState(false);
  const [groupsStatusError, setGroupsStatusError] = useState(null);

  const handleShowRoomCode = useCallback(() => {
    setShowRoomCode(true);
    setIsCodeCopied(false);
  }, []);

  const handleHideRoomCode = useCallback(() => {
    setShowRoomCode(false);
    setShareError(null);
    setIsCodeCopied(false);
  }, []);

  const handleShowDeactivateConfirm = useCallback(() => {
    setShowDeactivateConfirm(true);
  }, []);

  const handleHideDeactivateConfirm = useCallback(() => {
    setShowDeactivateConfirm(false);
  }, []);

  const handleShowLeaveConfirm = () => {
    setShowLeaveConfirm(true);
  };

  const handleHideLeaveConfirm = () => {
    setShowLeaveConfirm(false);
  };

  const handleDeactivateRoom = useCallback(async () => {
    try {
      // TODO: 매칭방 비활성화 API 호출
      console.log('Deactivating room:', roomData.id);
      // API 호출 후 성공하면 방을 나가도록 처리
      onExitRoom();
    } catch (error) {
      console.error('Failed to deactivate room:', error);
      alert('매칭방 비활성화에 실패했습니다.');
    }
  }, [roomData.id, onExitRoom]);

  const handleShareCode = useCallback(async () => {
    try {
      const shareData = {
        title: '매칭방 초대',
        text: `${roomData.name} 매칭방에 참여하세요!`,
        url: `${window.location.origin}/join/${roomData.entryCode}`
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Web Share API를 지원하지 않는 경우 클립보드에 복사
        await navigator.clipboard.writeText(shareData.url);
        alert('매칭방 링크가 클립보드에 복사되었습니다.');
      }
      setShareError(null);
    } catch (error) {
      console.error('공유하기 실패:', error);
      setShareError('공유하기에 실패했습니다. 다시 시도해주세요.');
    }
  }, [roomData.name, roomData.entryCode]);

  const handleCopyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(roomData.entryCode);
      setIsCodeCopied(true);
      setTimeout(() => setIsCodeCopied(false), 2000); // 2초 후 복사 상태 초기화
    } catch (error) {
      console.error('코드 복사 실패:', error);
      setShareError('코드 복사에 실패했습니다. 다시 시도해주세요.');
    }
  }, [roomData.entryCode]);

  const handleExitRoom = async () => {
    try {
      setLoading(true);
      await updateMatchingStatus(roomData.id, 'LEFT_ROOM');
      onExitRoom();
      // URL 업데이트
      window.history.pushState({}, '', '/');
    } catch (error) {
      console.error('Failed to exit room:', error);
      setError(error.response?.data?.message || error.message || '매칭방 퇴장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setIsUpdatingStatus(true);
      setStatusError(null);
      await updateMatchingStatus(roomData.id, { status: newStatus });
      setShowStatusModal(false);
      
      if (newStatus === 'MATCHING_INACTIVE') {
        if (onRefreshRoomData) {
          await onRefreshRoomData();
        }
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      setStatusError(error.response?.data?.message || '상태 변경에 실패했습니다.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleShowStatusModal = () => {
    setShowStatusModal(true);
  };

  const handleHideStatusModal = () => {
    setShowStatusModal(false);
    setStatusError(null);
  };

  const handleShowManagerConfirm = (member) => {
    if (!isManager) {
      alert('매니저만 권한을 부여/삭제할 수 있습니다.');
      return;
    }
    setSelectedMember(member);
    setShowManagerConfirm(true);
    setManagerError(null);
  };

  const handleHideManagerConfirm = () => {
    setShowManagerConfirm(false);
    setSelectedMember(null);
    setManagerError(null);
  };

  const handleGrantManagerRole = async () => {
    if (!selectedMember) return;

    try {
      setIsUpdatingManager(true);
      setManagerError(null);
      await grantManagerRole(roomData.id, selectedMember.memberId);
      if (onRefreshRoomData) {
        await onRefreshRoomData();
      }
      handleHideManagerConfirm();
    } catch (error) {
      console.error('Failed to grant manager role:', error);
      const errorMessage = error.response?.data?.message || '매니저 권한 부여에 실패했습니다.';
      setManagerError(errorMessage);
    } finally {
      setIsUpdatingManager(false);
    }
  };

  const handleRevokeManagerRole = async () => {
    if (!selectedMember) return;

    try {
      setIsRevokingManager(true);
      setManagerError(null);
      await revokeManagerRole(roomData.id, selectedMember.memberId);
      if (onRefreshRoomData) {
        await onRefreshRoomData();
      }
      handleHideManagerConfirm();
    } catch (error) {
      console.error('Failed to revoke manager role:', error);
      const errorMessage = error.response?.data?.message || '매니저 권한 삭제에 실패했습니다.';
      setManagerError(errorMessage);
    } finally {
      setIsRevokingManager(false);
    }
  };

  const handleShowMatchingOptions = () => {
    setShowMatchingOptions(true);
    setMatchingError(null);
    setSelectedPlayers([]);
    setCurrentGroup([]);
    setCustomGroups([]);
  };

  const handleHideMatchingOptions = () => {
    setShowMatchingOptions(false);
    setMatchingError(null);
    setSelectedPlayers([]);
    setCurrentGroup([]);
    setCustomGroups([]);
  };

  const handleStartMatching = async (type) => {
    try {
      setIsStartingMatching(true);
      setMatchingError(null);
      await startMatching(roomData.id, type);
      if (onRefreshRoomData) {
        await onRefreshRoomData();
      }
      handleHideMatchingOptions();
    } catch (error) {
      console.error('Failed to start matching:', error);
      setMatchingError(error.response?.data?.message || '매칭 시작에 실패했습니다.');
    } finally {
      setIsStartingMatching(false);
    }
  };

  const handleStartCustomMatching = async () => {
    try {
      setIsStartingMatching(true);
      setMatchingError(null);
      
      if (selectedPlayers.length !== 4) {
        setMatchingError('정확히 4명의 플레이어를 선택해야 합니다.');
        return;
      }

      await startCustomMatching(roomData.id, selectedPlayers);
      if (onRefreshRoomData) {
        await onRefreshRoomData();
      }
      handleHideMatchingOptions();
    } catch (error) {
      console.error('Failed to start custom matching:', error);
      setMatchingError(error.response?.data?.message || '커스텀 매칭 시작에 실패했습니다.');
    } finally {
      setIsStartingMatching(false);
    }
  };

  const handlePlayerSelect = (player) => {
    if (selectedPlayers.length < 4) {
      setSelectedPlayers([...selectedPlayers, player.memberId]);
      setCurrentGroup([...currentGroup, player]);
    }
  };

  const handleRemovePlayer = (playerId) => {
    setCurrentGroup(currentGroup.filter(p => p.memberId !== playerId));
    setSelectedPlayers(selectedPlayers.filter(id => id !== playerId));
  };

  const handleAddGroup = () => {
    if (currentGroup.length === 4) {
      setCustomGroups([...customGroups, currentGroup]);
      setCurrentGroup([]);
    }
  };

  const handleRemoveGroup = (groupIndex) => {
    const newGroups = [...customGroups];
    newGroups.splice(groupIndex, 1);
    setCustomGroups(newGroups);
    setSelectedPlayers(selectedPlayers.filter(id => 
      !newGroups.flatMap(g => g.map(p => p.memberId)).includes(id)
    ));
  };

  const handleShowMemberReplaceModal = (group, member) => {
    setSelectedGroup(group);
    setSelectedMember(member);
    setShowMemberReplaceModal(true);
    setReplaceError(null);
  };

  const handleHideMemberReplaceModal = () => {
    setShowMemberReplaceModal(false);
    setSelectedGroup(null);
    setSelectedMember(null);
    setReplaceError(null);
  };

  const handleReplaceMember = async (targetMemberId) => {
    if (!selectedGroup || !selectedMember) return;

    try {
      setIsReplacingMember(true);
      setReplaceError(null);
      await replaceGroupMember(
        roomData.id, 
        selectedGroup.id, 
        targetMemberId,           // targetMemberId (바뀔 대상 - 현재 그룹의 멤버)
        selectedMember.memberId   // replacementMemberId (바뀌는 대상 - 대기 목록에서 선택한 멤버)
      );
      if (onRefreshRoomData) {
        await onRefreshRoomData();
      }
      handleHideMemberReplaceModal();
    } catch (error) {
      console.error('Failed to replace member:', error);
      setReplaceError(error.response?.data?.message || '멤버 교체에 실패했습니다.');
    } finally {
      setIsReplacingMember(false);
    }
  };

  const handleUpdateGroupStatus = async (groupId, status) => {
    try {
      setIsUpdatingGroupsStatus(true);
      setGroupsStatusError(null);
      await updateAllGroupsStatus(roomData.id, status, groupId);
      if (onRefreshRoomData) {
        await onRefreshRoomData();
      }
    } catch (error) {
      console.error('Failed to update group status:', error);
      setGroupsStatusError(error.response?.data?.message || '그룹 상태 변경에 실패했습니다.');
    } finally {
      setIsUpdatingGroupsStatus(false);
    }
  };

  const renderManagerControls = useCallback(() => {
    if (!isManager) return null;

    return (
      <div className="flex space-x-2 mb-4">
        <button
          onClick={handleShowRoomCode}
          className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
        >
          <QrCodeIcon className="w-4 h-4 mr-1" />
          매칭방 코드
        </button>
        <button
          onClick={handleShowMatchingOptions}
          disabled={isStartingMatching}
          className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            isStartingMatching 
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
              : 'text-green-600 bg-green-50 hover:bg-green-100'
          }`}
        >
          <UserGroupIcon className="w-4 h-4 mr-1" />
          {isStartingMatching ? '매칭 중...' : '매칭 만들기'}
        </button>
        <button
          onClick={handleShowDeactivateConfirm}
          className="flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
        >
          <NoSymbolIcon className="w-4 h-4 mr-1" />
          매칭방 비활성화
        </button>
      </div>
    );
  }, [isManager, handleShowRoomCode, handleShowDeactivateConfirm, handleShowMatchingOptions, isStartingMatching]);

  const renderWaitingList = () => {
    if (!roomData?.enterMebmerList?.length) {
      return (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">대기 중인 플레이어가 없습니다.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-4 gap-2">
        {roomData.enterMebmerList.map((player) => {
          const isInGroup = roomData.groupList?.some(group => 
            group.memberList.some(member => member.memberId === player.memberId)
          );
          
          return (
            <div 
              key={player.memberId} 
              className={`bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 ${
                isInGroup ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
              onClick={() => {
                if (!isInGroup && isManager) {
                  handleShowMemberReplaceModal(null, player);
                }
              }}
            >
              <div className="p-2">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <div className="bg-blue-50 p-1 rounded-full mb-1">
                      <UserCircleIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    {player.isManger && (
                      <div className="absolute -top-1 -right-1 bg-blue-600 rounded-full p-0.5">
                        <ShieldCheckIcon className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-gray-900 mb-1 truncate w-full">
                    {player.name}
                    {player.isManger && (
                      <span className="ml-1 text-[10px] text-blue-600">(매니저)</span>
                    )}
                  </p>
                  <div className="flex flex-col space-y-0.5 w-full">
                    <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-800">
                      {player.level}
                    </span>
                    <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-800">
                      {player.status}
                    </span>
                  </div>
                  {isManager && !isInGroup && (
                    <div className="mt-2">
                      <span className="text-[10px] text-blue-600">클릭하여 교체</span>
                    </div>
                  )}
                  <div className="flex items-center text-[10px] text-gray-500 mt-1">
                    <ClockIcon className="h-3 w-3 mr-0.5" />
                    <span>대기</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMatchedGroups = () => {
    if (!roomData?.groupList?.length) {
      return (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">매칭된 그룹이 없습니다.</p>
        </div>
      );
    }

    return (
      <div>
        {groupsStatusError && (
          <div className="mb-4 p-3 bg-red-50 rounded-md">
            <p className="text-sm text-red-600 text-center">{groupsStatusError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {roomData.groupList.map((group, index) => (
            <div key={group.id} className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">그룹 {index + 1}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      코트 {group.courtNumber || '미정'}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      group.status === 'PLAYING' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : group.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {group.status === 'PLAYING' 
                        ? '게임중'
                        : group.status === 'COMPLETED'
                        ? '게임완료'
                        : '대기중'}
                    </span>
                  </div>
                </div>
                {isManager && (
                  <div className="flex space-x-2 mb-3">
                    <button
                      onClick={() => handleUpdateGroupStatus(group.id, 'PLAYING')}
                      disabled={isUpdatingGroupsStatus || group.status === 'PLAYING'}
                      className="flex items-center px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors disabled:opacity-50"
                    >
                      <PlayIcon className="w-3 h-3 mr-1" />
                      게임중으로 변경
                    </button>
                    <button
                      onClick={() => handleUpdateGroupStatus(group.id, 'COMPLETED')}
                      disabled={isUpdatingGroupsStatus || group.status === 'COMPLETED'}
                      className="flex items-center px-2 py-1 text-xs font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-md transition-colors disabled:opacity-50"
                    >
                      <CheckCircleIcon className="w-3 h-3 mr-1" />
                      게임완료로 변경
                    </button>
                  </div>
                )}
                <div className="grid grid-cols-4 gap-2">
                  {group.memberList.map((player) => (
                    <div 
                      key={player.memberId} 
                      className="bg-gray-50 rounded-lg shadow-sm border border-gray-100 relative group"
                    >
                      <div className="p-2">
                        <div className="flex flex-col items-center text-center">
                          <div className="bg-blue-50 p-1 rounded-full mb-1">
                            <UserCircleIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <p className="text-xs font-semibold text-gray-900 mb-1 truncate w-full">{player.name}</p>
                          <div className="flex flex-col space-y-0.5 w-full">
                            <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-800">
                              {player.level}
                            </span>
                            <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-800">
                              {player.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      {isManager && (
                        <button
                          onClick={() => handleShowMemberReplaceModal(group, player)}
                          className="absolute top-1 right-1 p-1 text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="멤버 교체"
                        >
                          <ArrowPathIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 헤더 - 고정 */}
      <div className="flex-none bg-white shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {roomData?.name || '매칭룸'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {new Date().toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <button
              onClick={handleShowStatusModal}
              className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors"
            >
              <EllipsisVerticalIcon className="h-5 w-5 mr-1" />
              상태 변경
            </button>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 - 스크롤 가능 */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="space-y-6">
            {/* 매니저 컨트롤 */}
            {renderManagerControls()}

            {/* 대기 목록 */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <UserGroupIcon className="h-5 w-5 mr-2 text-blue-600" />
                대기 목록
              </h2>
              {renderWaitingList()}
            </div>

            {/* 매칭된 그룹 */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <UserGroupIcon className="h-5 w-5 mr-2 text-green-600" />
                매칭된 그룹
              </h2>
              {renderMatchedGroups()}
            </div>

            {/* 매칭 버튼 */}
            <div className="mt-6 mb-4 space-y-3">
              {isManager && (
                <button
                  onClick={onStartMatching}
                  className="w-full bg-gray-50 text-blue-600 py-3 px-4 rounded-lg hover:bg-gray-100 border border-gray-200 transition-colors font-medium shadow-sm hover:shadow-md"
                >
                  매칭 시작하기
                </button>
              )}
              <button
                onClick={handleShowLeaveConfirm}
                disabled={isUpdatingStatus}
                className="w-full bg-gray-50 text-red-600 py-3 px-4 rounded-lg hover:bg-gray-100 border border-gray-200 transition-colors font-medium shadow-sm hover:shadow-md"
              >
                나가기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 상태 변경 모달 */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">상태 변경</h2>
              <button
                onClick={handleHideStatusModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="mb-6">
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => handleStatusChange('WAITING')}
                  disabled={isUpdatingStatus}
                  className="p-3 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md disabled:opacity-50 transition-colors"
                >
                  대기중으로 변경
                </button>
                <button
                  onClick={() => handleStatusChange('MATCHING_INACTIVE')}
                  disabled={isUpdatingStatus}
                  className="p-3 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md disabled:opacity-50 transition-colors"
                >
                  매칭 비활성화
                </button>
              </div>
              {statusError && (
                <p className="mt-3 text-sm text-red-600 text-center">
                  {statusError}
                </p>
              )}
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleHideStatusModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 매칭방 코드 모달 */}
      {showRoomCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">매칭방 코드</h2>
              <button
                onClick={handleHideRoomCode}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <QrCodeIcon className="w-24 h-24 text-blue-600" />
                </div>
              </div>
              <p className="text-center text-gray-700 mb-2">매칭방 코드</p>
              <div className="flex items-center justify-center space-x-2 mb-2">
                <p className="text-2xl font-bold text-blue-600">
                  {roomData?.entryCode || '코드 없음'}
                </p>
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  title="코드 복사하기"
                >
                  {isCodeCopied ? (
                    <ClipboardDocumentCheckIcon className="w-5 h-5 text-green-600" />
                  ) : (
                    <ClipboardIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {isCodeCopied && (
                <p className="text-center text-sm text-green-600 mt-1">
                  코드가 복사되었습니다
                </p>
              )}
              <p className="text-center text-sm text-gray-500 mt-2">
                이 코드를 다른 플레이어와 공유하여 매칭방에 참여할 수 있습니다.
              </p>
              {shareError && (
                <p className="text-center text-sm text-red-500 mt-2">
                  {shareError}
                </p>
              )}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleShareCode}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                <ShareIcon className="w-4 h-4 mr-1" />
                공유하기
              </button>
              <button
                onClick={handleHideRoomCode}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 매칭방 비활성화 확인 모달 */}
      {showDeactivateConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-red-600">매칭방 비활성화</h2>
              <button
                onClick={handleHideDeactivateConfirm}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <NoSymbolIcon className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <p className="text-center text-gray-700">
                매칭방을 비활성화하시겠습니까?<br />
                이 작업은 되돌릴 수 없습니다.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleHideDeactivateConfirm}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                취소
              </button>
              <button
                onClick={handleDeactivateRoom}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                비활성화
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 나가기 확인 모달 */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">매칭방 나가기</h2>
              <button
                onClick={handleHideLeaveConfirm}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gray-100 p-3 rounded-full">
                  <XMarkIcon className="w-8 h-8 text-gray-600" />
                </div>
              </div>
              <p className="text-center text-gray-700">
                매칭방을 나가시겠습니까?<br />
                나가기를 취소할 수 없습니다.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleHideLeaveConfirm}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                취소
              </button>
              <button
                onClick={handleExitRoom}
                disabled={loading}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md disabled:opacity-50 ${
                  loading ? 'bg-gray-500 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {loading ? '처리 중...' : '나가기'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 매니저 권한 부여/삭제 확인 모달 */}
      {showManagerConfirm && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {selectedMember.isManger ? '매니저 권한 삭제' : '매니저 권한 부여'}
              </h2>
              <button
                onClick={handleHideManagerConfirm}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className={`p-3 rounded-full ${selectedMember.isManger ? 'bg-red-100' : 'bg-blue-100'}`}>
                  {selectedMember.isManger ? (
                    <UserMinusIcon className="w-8 h-8 text-red-600" />
                  ) : (
                    <UserPlusIcon className="w-8 h-8 text-blue-600" />
                  )}
                </div>
              </div>
              <p className="text-center text-gray-700">
                {selectedMember.name}님의 매니저 권한을 {selectedMember.isManger ? '삭제' : '부여'}하시겠습니까?<br />
                {selectedMember.isManger 
                  ? '매니저 권한이 삭제되면 매칭방을 관리할 수 없습니다.'
                  : '매니저는 매칭방을 관리할 수 있습니다.'}
              </p>
              {managerError && (
                <p className="mt-3 text-sm text-red-600 text-center">
                  {managerError}
                </p>
              )}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleHideManagerConfirm}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                취소
              </button>
              <button
                onClick={selectedMember.isManger ? handleRevokeManagerRole : handleGrantManagerRole}
                disabled={isUpdatingManager || isRevokingManager}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md disabled:opacity-50 ${
                  selectedMember.isManger 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isUpdatingManager || isRevokingManager 
                  ? '처리 중...' 
                  : selectedMember.isManger ? '권한 삭제' : '권한 부여'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 매칭 옵션 모달 */}
      {showMatchingOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">매칭 만들기</h2>
                <button
                  onClick={handleHideMatchingOptions}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => handleStartMatching('RANDOM')}
                  disabled={isStartingMatching}
                  className="flex flex-col items-center p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <ArrowsRightLeftIcon className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-lg font-medium text-blue-900 mb-2">일반 랜덤 매칭</h3>
                  <p className="text-sm text-blue-700 text-center">
                    대기 중인 플레이어들을 완전 랜덤으로 매칭합니다.
                  </p>
                </button>
                <button
                  onClick={() => handleStartMatching('BALANCED')}
                  disabled={isStartingMatching}
                  className="flex flex-col items-center p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <ScaleIcon className="w-12 h-12 text-green-600 mb-4" />
                  <h3 className="text-lg font-medium text-green-900 mb-2">밸런스 랜덤 매칭</h3>
                  <p className="text-sm text-green-700 text-center">
                    팀의 밸런스를 고려하여 랜덤 매칭합니다.
                  </p>
                </button>
                <button
                  onClick={handleStartCustomMatching}
                  disabled={isStartingMatching || selectedPlayers.length !== 4}
                  className="flex flex-col items-center p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <UserGroupSolidIcon className="w-12 h-12 text-purple-600 mb-4" />
                  <h3 className="text-lg font-medium text-purple-900 mb-2">커스텀 매칭</h3>
                  <p className="text-sm text-purple-700 text-center">
                    정확히 4명의 플레이어를 선택하여 매칭합니다.
                  </p>
                </button>
              </div>

              {/* 커스텀 매칭 플레이어 선택 UI */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* 대기 중인 플레이어 목록 */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    대기 중인 플레이어 ({selectedPlayers.length}/4)
                  </h3>
                  <div className="space-y-2">
                    {roomData?.enterMebmerList?.filter(player => !selectedPlayers.includes(player.memberId)).map(player => (
                      <button
                        key={player.memberId}
                        onClick={() => handlePlayerSelect(player)}
                        disabled={selectedPlayers.length >= 4}
                        className="w-full flex items-center p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <UserCircleIcon className="w-5 h-5 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700">{player.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 선택된 플레이어 */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">선택된 플레이어</h3>
                  <div className="space-y-2">
                    {currentGroup.map(player => (
                      <div
                        key={player.memberId}
                        className="flex items-center justify-between p-2 bg-purple-50 rounded-md"
                      >
                        <div className="flex items-center">
                          <UserCircleIcon className="w-5 h-5 text-purple-500 mr-2" />
                          <span className="text-sm text-purple-700">{player.name}</span>
                        </div>
                        <button
                          onClick={() => handleRemovePlayer(player.memberId)}
                          className="text-purple-500 hover:text-purple-700"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {matchingError && (
                <div className="mt-4 p-3 bg-red-50 rounded-md">
                  <p className="text-sm text-red-600 text-center">{matchingError}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 멤버 교체 모달 */}
      {showMemberReplaceModal && selectedGroup && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">멤버 교체</h2>
              <button
                onClick={handleHideMemberReplaceModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="mb-6">
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-600 mb-2">교체할 멤버:</p>
                <div className="flex items-center">
                  <UserCircleIcon className="w-8 h-8 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{selectedMember.name}</p>
                    <p className="text-sm text-gray-500">그룹 {roomData.groupList.indexOf(selectedGroup) + 1}</p>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-4">대기 목록에서 교체할 멤버를 선택하세요:</p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {roomData.enterMebmerList
                  .filter(player => !selectedGroup.memberList.some(member => member.memberId === player.memberId))
                  .map(player => (
                    <button
                      key={player.memberId}
                      onClick={() => handleReplaceMember(player.memberId)}
                      disabled={isReplacingMember}
                      className="w-full flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                      <UserCircleIcon className="w-5 h-5 text-gray-500 mr-3" />
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-gray-900">{player.name}</p>
                        <p className="text-xs text-gray-500">레벨: {player.level}</p>
                      </div>
                      <ArrowPathIcon className="w-5 h-5 text-blue-500" />
                    </button>
                  ))}
              </div>
              {replaceError && (
                <p className="mt-3 text-sm text-red-600 text-center">
                  {replaceError}
                </p>
              )}
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleHideMemberReplaceModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MatchingRoomScreen; 