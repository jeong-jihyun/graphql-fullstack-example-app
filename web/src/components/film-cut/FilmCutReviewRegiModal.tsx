import { Button, ButtonGroup, FormControl, FormErrorMessage, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import {
    CutDocument,
    CutQuery,
    CreateOrUpdateCutReviewMutationVariables as CutReviewVars,
    useCreateOrUpdateCutReviewMutation as useCreateCutReview
} from '../../generated/graphql';

interface FilmCutReviewRegiModalProps {
    cutId: number;
    isOpen: boolean;
    onClose: () => void;
}
const FilmCutReviewRegiModal = ({ cutId, isOpen, onClose }: FilmCutReviewRegiModalProps): JSX.Element => {
    const toast = useToast();
    const [mutation, { loading }] = useCreateCutReview();
    const { register, handleSubmit, formState: { errors } } = useForm<CutReviewVars>({
        defaultValues: {
            cutReviewInput: { cutId }
        }
    });

    const onSubmit = (formData: CutReviewVars) => {
        // console.log(formData)
        mutation({
            variables: formData,
            // 뮤테이션 요청 함수의 update옵션을 통해 캐시를 업데이트
            update: (cache, { data }) => { // update옵션 캐시객체

                if (data && data.createOrUpdateCutReview) {
                    // 기존 감상평이 수정되었는지를 파악합니다. 기존 감상평을 수정할 경우 cache.evict통해 내용을 제거
                    const currentCut = cache.readQuery<CutQuery>({
                        query: CutDocument,
                        variables: { cutId },
                    });
                    if (currentCut) {
                        const isEdited = currentCut.cutReviews
                            .map((review) => review.id)
                            .includes(data.createOrUpdateCutReview.id);
                        if (isEdited) {
                            // 아폴로 캐시에서 제어하므로 감상평이 새로 생성되거나 수정되었을 때 개시를 업데이트 
                            cache.evict({
                                id: `CutReview:${data.createOrUpdateCutReview.id}`,
                            });
                        }
                        cache.writeQuery<CutQuery>({
                            query: CutDocument,
                            data: {
                                ...currentCut,
                                cutReviews: isEdited
                                    ? [...currentCut.cutReviews]
                                    : [
                                        data.createOrUpdateCutReview,
                                        ...currentCut.cutReviews.slice(0, 1),
                                    ],
                            },
                            variables: { cutId },
                        });
                    }
                }
            },
        })
            .then(onClose)
            .catch(() => {
                toast({ title: '감상평 등록 실패', status: 'error' });
            });
    }
    return (
        <Modal isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent as={'form'} onSubmit={handleSubmit(onSubmit)}>
                <ModalHeader>감상 남기기</ModalHeader>
                <ModalBody>
                    <FormControl isInvalid={!!errors.cutReviewInput?.contents}>
                        <Textarea

                            {...register('cutReviewInput.contents', {
                                required: { value: true, message: '감상평을 입력해주세요' },
                                maxLength: {
                                    value: 500,
                                    message: '500자를 초과할 수 없습니다.'
                                }
                            })}
                            placeholder='장면에 대한 개인적인 감상읖 남겨주세요' />
                        <FormErrorMessage>
                            {errors.cutReviewInput?.contents?.message}
                        </FormErrorMessage>
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <ButtonGroup>
                        <Button colorScheme="teal" type="submit" isDisabled={loading}>
                            등록
                        </Button>
                        <Button onClick={onClose}>취소</Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default FilmCutReviewRegiModal

