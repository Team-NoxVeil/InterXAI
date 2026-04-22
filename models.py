from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone

class Custominterviews(models.Model):
    org = models.ForeignKey(organization,on_delete=models.CASCADE)
    desc = models.TextField()
    post = models.TextField()
    experience = models.CharField(max_length=10)
    submissionDeadline = models.DateTimeField()
    startTime = models.DateTimeField()
    endTime = models.DateTimeField()
    duration = models.IntegerField(default=60)
    DSA = models.IntegerField(blank=True,null=True)
    Dev = models.IntegerField(blank=True,null=True)
    resume_shortlist_Score = models.FloatField(defAULT = 100, max=10)
    ask_questions_on_resume = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f'{self.org.orgname}-{self.post}'

class Customquestion(models.Model):
    interview = models.ForeignKey(Custominterviews, on_delete=models.CASCADE, related_name='questions')
    question = models.TextField()
    answer = models.TextField(blank=True, null=True)
    def __str__(self):
        return f'{self.interview.org.orgname}-{self.question[:50]}...'
class DsaTopics(models.Model):
    interview = models.ForeignKey(Custominterviews, on_delete=models.CASCADE, related_name='dsa_topics' )
    topic = models.CharField(max_length=100)
    difficulty = models.CharField(max_length=20)
    def __str__(self):
        return f'{self.interview.org.orgname}-{self.topic}'
class Application(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    interview = models.ForeignKey(Custominterviews, on_delete=models.CASCADE, related_name='applications')
    approved = models.BooleanField(default=False)
    resume = models.CharField(max_length=255, blank=True, null=True)
    applied_at = models.DateTimeField(auto_now_add=True,blank=True, null=True)
    extratedResume = models.TextField(blank=True,null=True)
    score = models.FloatField(default=0)
    shortlisting_decision = models.BooleanField(default=False)
    feedback = models.TextField(blank=True, null=True)
    def __str__(self):
        return f'{self.user.username}-{self.interview.org.orgname}'

class InterviewSession(models.Model):
    Application = models.ForeignKey(Application, on_delete=models.CASCADE)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(blank=True, null=True)
    current_round = models.TextField Enum = ["custom_questions", "resume", "DSA",]
    current_question_index = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=[('scheduled', 'Scheduled'), ('completed', 'Completed'), ('cancelled', 'Cancelled'),('cheated','cheated'),('ongoing','Ongoing')], default='scheduled')
    feedback = models.TextField(blank=True, null=True)
    score = models.FloatField(blank=True, null=True)
    recommendation = models.CharField(max_length=50, blank=True, null=True)
    strengths = models.TextField(blank=True, null=True)
    def __str__(self):
        return f'{self.Application.user.username}-{self.start_time}'

class Interaction(models.Model):
    session = models.ForeignKey(InterviewSession, on_delete=models.CASCADE,related_name="session")
    Customquestion = models.ForeignKey(Customquestion, on_delete=models.CASCADE)
    score = models.FloatField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    feedback = models.TextField(blank=True, null=True)
    def __str__(self):
        return f'{self.session.Application.user.username}-{self.Customquestion.question[:50]}...'

class FollowUpQuestions(models.Model):
    Interaction = models.ForeignKey(Interaction, on_delete=models.CASCADE,related_name="interaction")
    question = models.TextField()
    answer = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f'{self.Interaction.session.Application.user.username}-{self.question[:50]}...'

class DSAInteractions(models.Model):
    session = models.ForeignKey(InterviewSession, on_delete=models.CASCADE, related_name="dsa_sessions", blank=True, null=True)
    topic = models.ForeignKey(DsaTopics, on_delete=models.CASCADE, related_name="dsa_topics",blank=True, null=True)
    question = models.TextField(blank=True, null=True)
    code = models.TextField(blank=True, null=True)
    score = models.FloatField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class resumeconversation(models.Model):
    Session = models.ForeignKey(Session,on_delete=models.CASCADE)
    time = models.DateTimeField(auto_now_add=True)
    feedback = models.TextField

class resquestions(models.Model):
    convo = models.ForeignKey(resumeconvo, on_delete=models.CASCADE, db_index=True, default=1)
    question = models.TextField(default="Default question text")
    answer = models.TextField(blank=True, Null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f'{self.convo.Application.user.username}-{self.id}'

class organization(models):
    name = models.CharField(max_length=100)
    address = models.TextField()
    email = models.EmailField(unique=True, blank=True, null=True)
    url = models.CharFiels
    linkedin = models.CharField
    photo = models.CharField(null=True, blank=True, max_length=255)
    Description = models.TextField()
    def __str__(self):
        return self.orgname


class UserProfile(models.Model):
    user= models.ForeignKey(User, on_delete=models.CASCADE)
    leetcode = models.CharField(max_length=100)
    github = models.CharField(max_length=100)
    linkedin= models.CharFeld
    photo = models.CharField(max_length=100,blank=True,null=True)
    bio = modles.TextField