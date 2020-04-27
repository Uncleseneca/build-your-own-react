export function createResource() {
  return wrapPromise(fetchDogs);
}

const dogs = [
  "https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2018/01/12201051/cute-puppy-body-image.jpg",
  "https://miro.medium.com/max/1024/0*xc9fvuF4Cwn5yRaH.jpg",
  "https://secretldn.com/wp-content/uploads/2020/01/Portraits-of-Dogs-2.jpg",
  "https://cdn.pixabay.com/photo/2016/12/13/05/15/puppy-1903313__340.jpg",
  "https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2018/01/12201051/cute-puppy-body-image.jpg",
  "https://miro.medium.com/max/1024/0*xc9fvuF4Cwn5yRaH.jpg",
  "https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2018/01/12201051/cute-puppy-body-image.jpg",
  "https://miro.medium.com/max/1024/0*xc9fvuF4Cwn5yRaH.jpg",
  "https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2018/01/12201051/cute-puppy-body-image.jpg",
  "https://miro.medium.com/max/1024/0*xc9fvuF4Cwn5yRaH.jpg",
  "https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2018/01/12201051/cute-puppy-body-image.jpg",
  "https://miro.medium.com/max/1024/0*xc9fvuF4Cwn5yRaH.jpg",
  "https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2018/01/12201051/cute-puppy-body-image.jpg",
  "https://miro.medium.com/max/1024/0*xc9fvuF4Cwn5yRaH.jpg",
  "https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2018/01/12201051/cute-puppy-body-image.jpg",
  "https://miro.medium.com/max/1024/0*xc9fvuF4Cwn5yRaH.jpg",
  "https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2018/01/12201051/cute-puppy-body-image.jpg",
  "https://miro.medium.com/max/1024/0*xc9fvuF4Cwn5yRaH.jpg",
  "https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2018/01/12201051/cute-puppy-body-image.jpg",
  "https://miro.medium.com/max/1024/0*xc9fvuF4Cwn5yRaH.jpg",
  "https://miro.medium.com/max/1024/0*xc9fvuF4Cwn5yRaH.jpg",
  "https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2018/01/12201051/cute-puppy-body-image.jpg",
  "https://miro.medium.com/max/1024/0*xc9fvuF4Cwn5yRaH.jpg",
  "https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2018/01/12201051/cute-puppy-body-image.jpg",
  "https://miro.medium.com/max/1024/0*xc9fvuF4Cwn5yRaH.jpg",
  "https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2018/01/12201051/cute-puppy-body-image.jpg",
  "https://miro.medium.com/max/1024/0*xc9fvuF4Cwn5yRaH.jpg",
  "https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2018/01/12201051/cute-puppy-body-image.jpg",
  "https://miro.medium.com/max/1024/0*xc9fvuF4Cwn5yRaH.jpg"
];

function fetchDogs(numDogs) {
  return Promise.resolve(dogs.slice(0, numDogs));
}

function wrapPromise(promise) {
  let status = "pending";
  let result;
  let currentArg = null;
  let suspender = arg =>
    promise(arg).then(
      r => {
        status = "success";
        result = r;
      },
      e => {
        status = "error";
        result = e;
      }
    );
  return {
    read(arg) {
      if (currentArg !== arg) {
        status = "pending";
        currentArg = arg;
      }
      if (status === "pending") {
        throw suspender(arg);
      } else if (status === "error") {
        throw result;
      } else if (status === "success") {
        return result;
      }
    }
  };
}
