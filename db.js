// Design database for Zen class programme
// users collection
[{
  _id: ObjectId("user_id"),
  name: "User Name",
  email: "user@example.com",
  mentor_id: ObjectId("mentor_id"),
  joined_at: ISODate("2022-01-01T00:00:00Z")
}]
// codekata collection
[{
  _id: ObjectId("codekata_id"),
  user_id: ObjectId("user_id"),
  problems_solved: 10,
  submission_date: ISODate("2022-01-15T12:00:00Z")
}]
// attendance collection
[{
  _id: ObjectId("attendance_id"),
  user_id: ObjectId("user_id"),
  date: ISODate("2022-01-15T00:00:00Z"),
  status: "Present"
}]
// topics collection
[{
  _id: ObjectId("topic_id"),
  name: "Topic Name"
}]
// tasks collection
[{
  _id: ObjectId("task_id"),
  user_id: ObjectId("user_id"),
  task_name: "Task Name",
  submission_date: ISODate("2022-01-20T12:00:00Z")
}]
// company_drives collection
[{
  _id: ObjectId("company_drive_id"),
  name: "Company Drive Name",
  date: ISODate("2022-01-25T00:00:00Z")
}]
// mentors collection
[{
  _id: ObjectId("mentor_id"),
  name: "Mentor Name",
  mentees_count: 20
}]

//Find all the topics and tasks which are taught in the month of October
db.topics.find({
  "_id": {
    $in: db.tasks.distinct("topic_id", {
      "submission_date": {
        $gte: ISODate("2022-10-01T00:00:00Z"),
        $lt: ISODate("2022-11-01T00:00:00Z")
      }
    })
  }
})
//Find all the company drives which appeared between 15 Oct 2020 and 31 Oct 2020
db.company_drives.find({
  "date": {
    $gte: ISODate("2020-10-15T00:00:00Z"),
    $lte: ISODate("2020-10-31T23:59:59Z")
  }
})
//Find all the company drives and students who appeared for the placement
db.company_drives.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "user_id",
      as: "participants"
    }
  }
])
//Find the number of problems solved by the user in codekata:
db.codekata.aggregate([
  {
    $group: {
      _id: "$user_id",
      total_problems_solved: { $sum: "$problems_solved" }
    }
  }
])
// Find all the mentors with who has the mentee's count more than 15
db.mentors.find({
  "mentees_count": { $gt: 15 }
})
//Find the number of users who are absent and the task is not submitted between 15 Oct 2020 and 31 Oct 2020:
db.users.find({
  "_id": {
    $in: db.attendance.find({
      "date": {
        $gte: ISODate("2020-10-15T00:00:00Z"),
        $lte: ISODate("2020-10-31T23:59:59Z")
      },
      "status": "Absent"
    }).distinct("user_id")
  },
  "_id": {
    $nin: db.tasks.find({
      "submission_date": {
        $gte: ISODate("2020-10-15T00:00:00Z"),
        $lte: ISODate("2020-10-31T23:59:59Z")
      }
    }).distinct("user_id")
  }
})

