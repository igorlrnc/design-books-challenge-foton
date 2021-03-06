import React, { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Image,
  Text
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import { BiHeart } from 'react-icons/bi'
import Loading from '../../components/Loading'
import Header from '../../components/Header'

const Book = () => {
  // get book id
  const router = useRouter()
  const { book } = router.query

  // default likes number
  const [likes, setLikes] = useState(158)

  // set default notes and sum all of them
  const [note, setNote] = useState(0) // note from current user
  const notes = [5, 5, 5] // "from another users"

  // book is null before searching the API
  const [myBook, setMyBook] = useState(null)

  // values that tell whether the book has been liked or added as a favorite
  const [isLiked, setIsLiked] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  let ratedBook = false // informs if user has already given a note

  useEffect(() => {
    // get book by id and set to 'myBook' state
    async function findBook() {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes/${book}`
      )
      const data = await response.json()
      setMyBook(data)
    }

    findBook()
  }, [book])

  const handleUpdateLike = () => {
    isLiked ? setLikes(likes - 1) : setLikes(likes + 1)
    setIsLiked(!isLiked)
  }

  const handleUpdateAddAsFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  const rate = useMemo(() => {
    if (note > 0) {
      if (!ratedBook) {
        // if user doesn't rates the book, append note
        notes.push(note)
        ratedBook = true
      } else {
        // just replaces the users last note with the current one
        notes.pop()
        notes.push(note)
      }
    }

    const notesReducer = (accumulator, currentValue) =>
      accumulator + currentValue // reducer that will sum all notes

    return notes.reduce(notesReducer) / notes.length
  }, [notes]) // average note

  return myBook ? (
    <Stack spacing={0}>
      <Header isBookPage={true} />
      <Stack padding={[4, 4, 12, 12]} backgroundColor={'yellow.personal'}>
        <Stack width={['95vw', '80vw', '70vw', '70vw']}>
          <Stack isInline spacing={8} justifyContent={'center'}>
            <Stack alignItems={'center'}>
              <Image
                src={myBook?.volumeInfo?.imageLinks.thumbnail}
                height="auto"
                width="auto"
                shadow={'2xl'}
              />
              <Text fontWeight={'bold'}>
                {myBook?.volumeInfo?.pageCount} pages
              </Text>
            </Stack>
            <Stack spacing={2}>
              <Text fontWeight={'bold'} fontSize={'lg'}>
                {myBook?.volumeInfo?.title}
              </Text>
              <Text fontSize={'sm'} color={'gray.500'}>
                by {myBook?.volumeInfo?.authors?.join(', ')}{' '}
              </Text>
              <Stack spacing={2} alignItems={'flex-start'}>
                <Text>
                  {' '}
                  {myBook?.saleInfo?.retailPrice
                    ? `R$ ${myBook?.saleInfo.retailPrice.amount}`
                    : 'price not informed'}
                </Text>
                <Stack alignItems={'center'}>
                  <Stack spacing={2} isInline>
                    {[1, 2, 3, 4, 5].map((userNote) => (
                      <Box
                        key={userNote}
                        _hover={{
                          cursor: 'pointer'
                        }}
                        as={userNote <= note ? AiFillStar : AiOutlineStar}
                        onClick={() => setNote(userNote)}
                      />
                    ))}
                  </Stack>
                  <Text>{rate.toFixed(2)}</Text>
                </Stack>
              </Stack>
              <Divider />
              <Text fontSize={'xs'} fontWeight={'bold'} color={'gray.700'}>
                {likes} likes
              </Text>
              <Text fontSize={'xs'} color={'gray.700'}>
                {isFavorite ? 'Marcado como favorito' : ''}
              </Text>
            </Stack>
          </Stack>
          <Stack
            spacing={2}
            paddingX={3}
            isInline
            alignItems="center"
            width={'100%'}
            justifyContent={'flex-end'}>
            <Stack spacing={2} isInline>
              <Button
                variant={isLiked ? 'solid' : 'outline'}
                size="md"
                colorScheme={'blue'}
                borderRadius={'25px'}
                paddingX={4}
                onClick={handleUpdateLike}>
                {isLiked ? 'Liked' : 'Like'}
              </Button>

              <IconButton
                variant={isFavorite ? 'solid' : 'outline'}
                aria-label={'add as favorite'}
                borderRadius={'50%'}
                colorScheme={'pink'}
                onClick={handleUpdateAddAsFavorite}
                icon={<Box as={BiHeart} />}
                size="md"
              />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <Stack width={'100%'} padding={3} alignItems={'center'}>
        <Text textAlign={'justify'} width={['95vw', '80vw', '70vw', '70vw']}>
          {myBook.volumeInfo?.description}
        </Text>
      </Stack>
    </Stack>
  ) : (
    <Loading />
  )
}

export default Book
