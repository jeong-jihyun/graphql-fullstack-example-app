
import { AspectRatio, Box, Button, Center, Flex, HStack, Heading, Image, SimpleGrid, Text, useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react';
import { useMemo } from 'react';
import { FaHeart } from 'react-icons/fa';
import { CutDocument, CutQuery, CutQueryVariables, useVoteMutation } from '../../generated/graphql';
import { useMeQuery } from '../../generated/graphql'
import FilmCutReviewRegiModal from './FilmCutReviewRegiModal';
import FilmCutReview from './FilmCutReview';
import FilmCutReviewDeleteAlert from './FilmCutReviewDelete';

interface MoveCutDetailProps {
    cutImg: string;
    cutId: number;
    // 감상남기기를 위한 필드 추가
    isVoted?: boolean;
    votesCount?: number;
    reviews?: CutQuery['cutReviews']
}
/**
 * 
 * @param param0 
 * @returns 
 * @description
 *  FilmCutDetail = ({ cutImg, cutId }: MoveCutDetailProps) 아래와 같이 변경
 */
const FilmCutDetail = ({ cutImg, cutId, isVoted = false, votesCount = 0, reviews }: MoveCutDetailProps) => {
    const reviewRegiDialog = useDisclosure();
    // 경고 메세지 표시
    const toast = useToast();
    const voteButtonColor = useColorModeValue('gray.500', 'gray.400')
    const [vote, { loading: voteLoading }] = useVoteMutation({
        variables: { cutId },
        // update
        update: (cache, fetchResult) => {
            // cut Query 데이타 조회
            const currentCut = cache.readQuery<CutQuery, CutQueryVariables>({
                query: CutDocument,
                variables: { cutId }
            })
            // cut Query 데이터 재설정
            if (currentCut && currentCut.cut) {
                if (fetchResult.data?.vote) {
                    console.log(`currentCut.cut.id >>> ${currentCut.cut.id}`)
                    cache.writeQuery<CutQuery, CutQueryVariables>({
                        query: CutDocument,
                        variables: { cutId: currentCut.cut.id },
                        data: {
                            __typename: 'Query',
                            ...currentCut,
                            cut: {
                                ...currentCut.cut,
                                votesCount: isVoted ? currentCut.cut.votesCount - 1 : currentCut.cut.votesCount + 1,
                                isVoted: !isVoted
                            }
                        }
                    })
                }
            }
        }
    });

    const accessToken = localStorage.getItem('access_token')
    const { data: userData } = useMeQuery({ skip: !accessToken });

    const isLoggedIn = useMemo(() => {
        if (accessToken) return userData?.me?.id;
        return false;
    }, [accessToken, userData?.me?.id])


    //const reviewRegiDialog = useDisclosure();
    const deleteAlert = useDisclosure();

    return (
        <Box>
            <AspectRatio ratio={16 / 9}>
                <Image src={cutImg} objectFit={'cover'} fallbackSrc='' />
            </AspectRatio>
            <Box py={4}>
                <Flex justify={'space-between'} alignItems={'center'}>
                    <Heading size={'sm'}> {cutId} 번째 사진</Heading>
                    <HStack spacing={1} alignItems={'center'}>
                        <Button color={isVoted ? 'pink.400' : voteButtonColor}
                            aria-label='lik-this-cut-button'
                            leftIcon={<FaHeart />}
                            isLoading={voteLoading}
                            onClick={() => {
                                if (isLoggedIn) vote()
                                else
                                    toast({
                                        status: 'warning',
                                        description: '좋아요 표시는 로그인한 이후 가능합니다.'
                                    })
                            }} >
                            <Text>{votesCount}</Text>
                        </Button>
                        <Button colorScheme='teal' onClick={reviewRegiDialog.onOpen}>감상 남기기</Button>
                    </HStack>
                </Flex>
                {/* 감상목록 */}
                <Box mt={6}>
                    {!reviews || reviews.length === 0 ? (
                        <Center minH={100}>
                            <Text>제일 먼저 감상을 남겨보세요</Text>
                        </Center>
                    ) : (
                        <SimpleGrid mt={3} spacing={4}>
                            {reviews.map((review) => (
                                <FilmCutReview
                                    key={review.id}
                                    author={review.user.username}
                                    contents={review.contents}
                                    isMine={review.isMine}
                                    onEditClick={reviewRegiDialog.onOpen}
                                    onDeleteClick={deleteAlert.onOpen}
                                />
                            ))}
                        </SimpleGrid>
                    )}
                </Box>
            </Box>

            <FilmCutReviewRegiModal cutId={cutId} isOpen={reviewRegiDialog.isOpen} onClose={reviewRegiDialog.onClose} />
            <FilmCutReviewDeleteAlert
                target={reviews?.find((review) => review.isMine)}
                isOpen={deleteAlert.isOpen}
                onClose={deleteAlert.onClose}
            />
        </Box>
    )
}

export default FilmCutDetail
